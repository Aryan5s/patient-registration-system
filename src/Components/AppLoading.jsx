// src/Components/AppLoading.js
import React from 'react';
import { Spin, Flex, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'; // You might need to install antd icons

const { Title, Text } = Typography;

const AppLoading = () => {
  return (
    <Flex
      align="center"
      justify="center"
      vertical
      style={{
        minHeight: '100vh', // Take full viewport height
        backgroundColor: '#f0f2f5', // Light background color
        color: '#333',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 60, // Larger icon
              color: '#1890ff', // Ant Design primary blue
            }}
            spin
          />
        }
      />
      <Title level={2} style={{ marginTop: '20px', color: '#001529' }}>
        Patient Management System
      </Title>
      <Text style={{ fontSize: '18px', color: '#595959' }}>
        Initializing database and loading your data...
      </Text>
      <Text type="secondary" style={{ marginTop: '10px' }}>
        Please wait a moment.
      </Text>
    </Flex>
  );
};

export default AppLoading;