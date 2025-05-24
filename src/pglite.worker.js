// src/pglite.worker.js
import { PGlite } from '@electric-sql/pglite';
import { createPatientsTable, selectAllPatients } from './Common/GlobalQueries';

const DB_NAME = 'patient-db';
let dbInstance; // The single PGlite instance
const connectedPorts = new Set(); // <<< NEW: To store all connected MessagePorts for broadcasting

// <<< NEW FUNCTION: To broadcast a message to all connected clients >>>
const broadcastMessage = (message) => {
  connectedPorts.forEach(port => {
    try {
      port.postMessage(message);
    } catch (e) {
      console.error('[PGlite Shared Worker] Error broadcasting message to port (might be closed):', e);
      // Clean up disconnected ports on error
      connectedPorts.delete(port);
    }
  });
};

self.onconnect = async (event) => {
  const port = event.ports[0];
  connectedPorts.add(port); // <<< NEW: Add the new port to our set

  // <<< NEW: Handle port disconnection (e.g., tab closes) >>>
  port.onclose = () => {
    console.log('[PGlite Shared Worker] Port disconnected.');
    connectedPorts.delete(port);
  };

  if (!dbInstance) {
    console.log('[PGlite Shared Worker] Initializing PGlite database...');
    dbInstance = new PGlite(`idb://${DB_NAME}`);
    await dbInstance.exec(createPatientsTable);
    console.log('[PGlite Shared Worker] Database initialized and table created.');
  } else {
    console.log('[PGlite Shared Worker] Database already initialized, new connection.');
  }

  port.onmessage = async (e) => {
    const { id, type, query, params } = e.data;

    try {
      let result;
      switch (type) {
        case 'query':
          result = await dbInstance.query(query, params);
          port.postMessage({ id, type: 'queryResult', data: result.rows });
          // <<< NEW: If query was a DML (INSERT, UPDATE, DELETE), broadcast a dataUpdated signal >>>
          // Simple check: if query string doesn't start with SELECT (case-insensitive)
          if (!query.trim().toUpperCase().startsWith('SELECT')) {
            console.log('[PGlite Shared Worker] Data modification detected (query), broadcasting update.');
            broadcastMessage({ type: 'dataUpdated' });
          }
          break;
        case 'exec': // exec typically includes DDL but can also be DML.
          await dbInstance.exec(query);
          port.postMessage({ id, type: 'execResult', data: { success: true } });
          // <<< NEW: Assume exec also modifies data, broadcast update >>>
          console.log('[PGlite Shared Worker] Exec operation detected, broadcasting update.');
          broadcastMessage({ type: 'dataUpdated' });
          break;
        case 'getAllPatients':
            result = await dbInstance.query(selectAllPatients);
            port.postMessage({ id, type: 'getAllPatientsResult', data: result.rows });
            break;
        default:
          port.postMessage({ id, type: 'error', error: `Unknown worker message type: ${type}` });
      }
    } catch (error) {
      console.error(`[PGlite Shared Worker] Error processing message (ID: ${id}, Type: ${type}):`, error);
      port.postMessage({ id, type: 'error', error: error.message });
    }
  };

  port.postMessage({ type: 'workerReady' });
};