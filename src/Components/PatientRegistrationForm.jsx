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
  const {db , broadcastSync} = props;
  const { contextHolder, success, error} = useNotification();

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    
    const {name , age , gender} = formData
    // Execute Pglite query over here 
      try {
      const result = await db.query('INSERT INTO patients (name, age, gender) VALUES ($1 , $2 , $3)', [name , age , gender],);
      success('Patient Registered', `${name} has been added successfully.`); // Use the success function
      broadcastSync();
    } catch (err) {
      console.log(err.message)
      error('Error', err.message); // Use the error function
    }
    
    setFormData(initialFormData);
  };

  return (
    <>
    {/*The context holder is responsible for showing notification messages based on the result of the query*/}
    {contextHolder}

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
    </>
  );
};

export default PatientRegistrationForm;
