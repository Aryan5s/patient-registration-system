import { useState } from "react";
import { Form, Input, Button } from "antd";
import { PatientRegistrationFormRules } from "../Common/GlobalRules";
import useNotification from "../Hooks/useNotification";

const initialFormData = {
  name: "",
  age: "",
  gender: "",
};

// Receive fetchAllPatients from props
const PatientRegistrationForm = ({ db, fetchAllPatients }) => {
  // Destructure props
  const { contextHolder, success, error } = useNotification();
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const { name, age, gender } = formData;
    try {
      // Use the 'db' object provided by usePgliteDb, which talks to the worker
      await db.query(
        "INSERT INTO patients (name, age, gender) VALUES ($1 , $2 , $3)",
        [name, age, gender]
      );
      success("Patient Registered", `${name} has been added successfully.`);

      // to re-fetch all patients and update the shared `patientsData` state.
      if (fetchAllPatients) {
        // Ensure the function is available
        await fetchAllPatients();
      }
    } catch (err) {
      error("Error", err.message);
    }
    setFormData(initialFormData);
  };

  return (
    <>
      {contextHolder}
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        className="max-width-400 mb-2"
      >
        <Form.Item
          label="Name"
          required
          rules={PatientRegistrationFormRules.name}
        >
          <Input
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter name"
          />
        </Form.Item>
        <Form.Item label="Age" rules={PatientRegistrationFormRules.age}>
          <Input
            type="number"
            value={formData.age}
            onChange={handleChange("age")}
            placeholder="Enter age"
          />
        </Form.Item>
        <Form.Item label="Gender">
          <Input
            value={formData.gender}
            onChange={handleChange("gender")}
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
