import { Tabs, Layout, Typography } from 'antd';
import './styles/common.css'
import PatientRegistrationForm from './Components/PatientRegistrationForm';
import usePgliteDb from './Hooks/usePgliteDb';

const { Title } = Typography;
const { Content } = Layout;

function App() {

  const { db, initDone, broadcastSync } = usePgliteDb();

  if (!initDone) return <p>Loading database...</p>;

  const items = [
    {
      key: '1',
      label: 'Patient Registration',
      children: <PatientRegistrationForm db = {db} broadcastSync = {broadcastSync}/>,
    }
  ];

  return (
    <Layout style={{ padding: '2rem', minHeight: '100vh' }}>
      <Content>
        <Title level={2}>Patient Management System</Title>
        <Tabs defaultActiveKey="1" items={items} />
      </Content>
    </Layout>
  );
}

export default App;
