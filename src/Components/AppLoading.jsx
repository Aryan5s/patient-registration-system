import React from "react";
import { Spin, Flex, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AppLoading = () => {
  return (
    <Flex align="center" justify="center" vertical className="page-container">
      <Spin indicator={<LoadingOutlined className="loading-icon" spin />} />
      <Title level={2} className="app-title">
        Patient Management System
      </Title>
      <Text className="subtitle">
        Initializing database and loading your data...
      </Text>
      <Text type="secondary" className="secondary-text">
        Please wait a moment.
      </Text>
    </Flex>
  );
};

export default AppLoading;
