import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { PatientRegistrationFormRules } from '../Common/GlobalRules';

const initialFormData = {
  name: '',
  age: '',
  gender: '',
};

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    // Execute Pglite query over here 
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
