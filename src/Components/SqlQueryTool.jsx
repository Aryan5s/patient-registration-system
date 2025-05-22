import React, { useState } from "react";
import { Input, Button, Table, Typography, notification } from "antd";
import useNotification from "antd/es/notification/useNotification";

const { Title } = Typography;

function SqlQueryTool({ db }) {
  const { contexHolder, success, info, error } = useNotification();
  const [sql, setSql] = useState("");
  const [result, setResult] = useState(null);

  const handleQuery = async () => {
    try {
      const res = await db.query(sql);

      if (res.rows.length === 0) {
        info("No Data", "Query executed successfully but returned no rows.");
        setResult(null);
        return;
      }

      const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name"},
        { title: "Age", dataIndex: "age", key: "age"},
        { title: "Gender", dataIndex: "gender", key: "gender"}
      ];

      const dataSource = res.rows.map((row, index) => ({
        key: index,
        ...row,
      }));

      setResult({ columns, dataSource });
      success('Query Successful', `${res.rows.length} records have been fetched successfullly`); // Use the success function
    } catch (err) {
      error("SQL Error", err.message);
      setResult(null);
    }
  };

  return (
    <div>
      {contexHolder}
      <Input.Search
        value={sql}
        enterButton="Run SQL"
        onChange={(e) => setSql(e.target.value)}
        onSearch={handleQuery}
        style={{ marginBottom: "1.5rem" }}
        placeholder="Enter SQL query"
      />

      {result && (
        <>
          <Title level={4}>Query Result</Title>
          <Table
            columns={result.columns}
            dataSource={result.dataSource}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </>
      )}
    </div>
  );
}

export default SqlQueryTool;
