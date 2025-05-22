import { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { PatientRegistrationFormRules } from '../Common/GlobalRules';
import useNotification from '../Hooks/useNotification';

const initialFormData = {
  name: '',
  age: '',
  gender: '',
};

const PatientRegistrationForm = (props) => {
  const { contextHolder, success, info, warning, error } = useNotification();
  const {db , broadcastSync} = props;
  console.log(db);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {

    const {name , age , gender} = formData
    const id = 1;
    // Execute Pglite query over here 
      try {
        debugger;
      await db.exec(`INSERT INTO patients (id , name, age, gender) VALUES (${id}, ${name.trim()}, ${parseInt(age)}, ${gender?.trim() || null})`);
      success({
        message: 'Patient Registered',
        description: `${name} has been added successfully.`,
      });
      broadcastSync();
    } catch (err) {
        console.warn(err.message)
      error({
        message: 'Error',
        description: err.message,
      });
    }
    setFormData(initialFormData);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      className='max-width-400 mb-2'
    >
      <Form.Item
        label="Name"
        required
        rules={PatientRegistrationFormRules.name}
      >
        <Input
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="Enter name"
        />
      </Form.Item>

      <Form.Item
        label="Age"
        rules={PatientRegistrationFormRules.age}
      >
        <Input
          type="number"
          value={formData.age}
          onChange={handleChange('age')}
          placeholder="Enter age"
        />
      </Form.Item>

      <Form.Item label="Gender">
        <Input
          value={formData.gender}
          onChange={handleChange('gender')}
          placeholder="Enter gender"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PatientRegistrationForm;
