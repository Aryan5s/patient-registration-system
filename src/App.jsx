import { Tabs, Layout, Typography } from 'antd';
import './styles/common.css'
import PatientRegistrationForm from './Components/PatientRegistrationForm';

const { Title } = Typography;
const { Content } = Layout;

function App() {

  const items = [
    {
      key: '1',
      label: 'Patient Registration',
      children: <PatientRegistrationForm/>,
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
