import { useEffect, useState, useRef } from 'react';

let requestIdCounter = 0;
const generateRequestId = () => `req-${requestIdCounter++}`;

const usePgliteDb = () => {
  const [db, setDb] = useState(null); 
  const [initDone, setInitDone] = useState(false);
  const [patientsData, setPatientsData] = useState([]);
  const workerPortRef = useRef(null);
  const responseCallbacksRef = useRef({});

  const sendMessageToWorker = (type, payload) => {
    return new Promise((resolve, reject) => {
      if (!workerPortRef.current) {
        reject(new Error("Worker port not connected."));
        return;
      }
      const id = generateRequestId();
      responseCallbacksRef.current[id] = { resolve, reject };
      workerPortRef.current.postMessage({ id, type, ...payload });
    });
  };

  const fetchAllPatients = async () => {
    try {
      const response = await sendMessageToWorker('getAllPatients');
      setPatientsData(response.data);
      console.log('[usePgliteDb] Fetched all patients from worker (auto-update):', response.data); // Clarified log
    } catch (err) {
      console.error('[usePgliteDb] Error fetching all patients from worker:', err);
      setPatientsData([]);
    }
  };

  useEffect(() => {
    if (typeof SharedWorker === 'undefined') {
      console.error('Shared Web Workers are not supported in this browser.');
      setInitDone(true);
      return;
    }

    const worker = new SharedWorker(new URL('../pglite.worker.js', import.meta.url), { type: 'module', name: 'pglite-shared-worker' });
    workerPortRef.current = worker.port;

    worker.port.onmessage = async (e) => {
      const { id, type, data, error } = e.data;

      if (id && responseCallbacksRef.current[id]) {
        // This part handles responses to specific requests (query, exec, etc.)
        if (type === 'error') {
          responseCallbacksRef.current[id].reject(new Error(error || `Worker error for request ${id}`));
        } else {
          responseCallbacksRef.current[id].resolve({ type, data });
        }
        delete responseCallbacksRef.current[id];
      } else {
        // --- THIS IS THE NEW PART: Handle general worker messages like 'dataUpdated' ---
        switch (type) {
            case 'workerReady':
                console.log('[usePgliteDb] Shared Worker ready. Setting up DB proxy.');
                setDb({
                    query: async (sql, params) => {
                        const res = await sendMessageToWorker('query', { query: sql, params });
                        return { rows: res.data };
                    },
                    exec: async (sql) => {
                        await sendMessageToWorker('exec', { query: sql });
                        return { success: true };
                    },
                    fetchAllPatients: fetchAllPatients // Expose this for manual component calls
                });
                setInitDone(true);
                await fetchAllPatients(); // Initial data fetch on connection
                break;
            case 'dataUpdated': // <<< NEW CASE: Handle data update notification from worker >>>
                console.log('[usePgliteDb] Received dataUpdated signal from worker. Re-fetching data...');
                await fetchAllPatients(); // Trigger an immediate data refresh
                break;
            default:
                console.log('[usePgliteDb] Unhandled general worker message type:', type, e.data);
        }
      }
    };

    worker.port.start();

    return () => {
      console.log('[usePgliteDb] Closing Shared Worker port connection.');
      if (workerPortRef.current) {
        workerPortRef.current.close();
      }
    };
  }, []);

  return { db, initDone, patientsData, fetchAllPatients };
};

export default usePgliteDb;