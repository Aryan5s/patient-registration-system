// src/App.js
import { Tabs, Layout, Typography } from 'antd';
import './styles/common.css'
import './App.css'
import usePgliteDb from './Hooks/usePgliteDb';
import PatientRegistrationForm from './Components/PatientRegistrationForm';
import SqlQueryTool from './Components/SqlQueryTool';
import AppLoading from './Components/AppLoading';

const { Title } = Typography;
const { Content } = Layout;

function App() {
  // Use the new structure from usePgliteDb
  const { db, initDone, patientsData, fetchAllPatients } = usePgliteDb(); // Destructure fetchAllPatients

  if (!initDone) return <AppLoading/>

  const items = [
    {
      key: '1',
      label: 'Patient Registration',
      // Pass the db object (now representing the worker connection) and fetchAllPatients
      children: <PatientRegistrationForm db={db} fetchAllPatients={fetchAllPatients}/>,
    },
    {
      key: '2',
      label: 'Run SQL Query',
      // Pass the db object and patientsData
      children: <SqlQueryTool db={db} patientsData={patientsData}/>,
    },
  ];

  return (
    <Layout style={{ padding: '2rem', minHeight: '100vh' }}>
      <Content>
        <Title level={2}>Patient Management System</Title>
        <Tabs defaultActiveKey="1" items={items}/>
      </Content>
    </Layout>
  );
}

export default App;