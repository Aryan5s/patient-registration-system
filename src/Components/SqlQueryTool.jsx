import { useState, useEffect } from "react";
import { Input, Table, Typography } from "antd";
import useNotification from "../Hooks/useNotification";
import { patientColumns } from "../Common/GlobalSchemas";

const { Title } = Typography;

// Receive db (which talks to worker) and patientsData
function SqlQueryTool({ db, patientsData }) {
  // No need for fetchAllPatients here unless a custom query should trigger it
  const { contextHolder, success, info, error } = useNotification();
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [isCustomQueryExecuted , setIsCustomQueryExecuted] = useState(false);

  useEffect(() => {
   changeQueryResult();
  }, [patientsData]);

  useEffect(() => {
    // If there's no custom query result, ensure the table shows the full patientsData.
    if (!queryResult && sqlQuery === "") {
      changeQueryResult()
    }
  }, [patientsData, queryResult, sqlQuery]);

  const changeQueryResult = () => {
    setQueryResult({
      columns: patientColumns,
      dataSource: patientsData.map((row, index) => ({
        ...row,
        key: row.id || index,
      })),
    });
  };

  const handleQueryChange = (e) => {
    setSqlQuery(e.target.value);
    if (e.target.value === "") setQueryResult(null);
  };

  const handleQuery = async () => {
    // Ensure db is available before querying
    if (!db) {
      error(
        "Database not initialized",
        "Please wait for the database to connect."
      );
      return;
    }
    try {
      // db.query now sends the SQL to the shared worker
      const res = await db.query(sqlQuery);
      if (res.rows.length === 0) {
        info("No Data", "Query executed successfully but returned no rows.");
        setQueryResult(null);
        return;
      }

      const dynamicColumns = Object.keys(res.rows[0] || {}).map((key) => ({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        dataIndex: key,
        key: key,
      }));

      const dataSource = res.rows.map((row, index) => ({
        key: row.id || index,
        ...row,
      }));

      setQueryResult({ columns: dynamicColumns, dataSource });
      setIsCustomQueryExecuted(true);
      success(
        "Query Successful",
        `${res.rows.length} records have been fetched successfully`
      );
    } catch (err) {
      error("SQL Query Error", err.message);
      setQueryResult(null);
      setIsCustomQueryExecuted(false);
    }
  };

  // get the current Data source and Columns
  const currentDataSource = queryResult
    ? queryResult.dataSource
    : patientsData.map((row, index) => ({ ...row, key: row.id || index }));
  const currentColumns = queryResult ? queryResult.columns : patientColumns;

  return (
    <>
      {/*Context holder for Displaying Notifications*/}
      {contextHolder}
      <div>
        <Input.Search
          value={sqlQuery}
          enterButton="Run Query"
          onChange={handleQueryChange}
          onSearch={handleQuery}
          className="mb-2"
          placeholder="Enter SQL query (e.g., SELECT * FROM patients;)"
        />

        {currentDataSource.length > 0 ? (
          <>
            <Title level={4}>
              {isCustomQueryExecuted
                ? "Custom Query Result"
                : "All Registered Patients (Synced)"}
            </Title>
            <Table
              columns={currentColumns}
              dataSource={currentDataSource}
              pagination={{ pageSize: 5 }}
              bordered
            />
          </>
        ) : (
          <p>No data to display. Register a patient or run a query.</p>
        )}
      </div>
    </>
  );
}

export default SqlQueryTool;
