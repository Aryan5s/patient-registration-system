export const createPatientsTable = `
        CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER,
          gender TEXT
        );
      `

export const selectAllPatients = 'SELECT * FROM patients' 