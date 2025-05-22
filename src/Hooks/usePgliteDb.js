import { useEffect, useState } from 'react';
import { PGlite } from '@electric-sql/pglite';
import { createPatientsTable, selectAllPatients } from '../Common/GlobalQueries';

const DB_NAME = 'patient-db';
const CHANNEL_NAME = 'patient-sync';

const usePgliteDb = () => {
  const [db, setDb] = useState(null);
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    const init = async () => {
     try {
      const db = new PGlite(`idb://${DB_NAME}`);
      await db.exec(createPatientsTable);
      const schema = await db.query('SELECT * FROM patients');
      console.log(schema.rows);
      setDb(db);
      setInitDone(true);
    } catch (err) {
      console.error('Failed to initialize PGlite:', err);
    }
  };

    init();
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = async (e) => {
      if (db && e.data === 'sync') {
        const result = await db.query(selectAllPatients);
        console.log('Synced data across tabs:', result.rows);
      }
    };

    return () => channel.close();
  }, [db]);

  const broadcastSync = () => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage('sync');
    channel.close();
  };

  return { db, initDone, broadcastSync };
};

export default usePgliteDb;
