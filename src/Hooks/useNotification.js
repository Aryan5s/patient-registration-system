import { notification } from 'antd';

// Custom Hook for Notifications
const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();
  const showNotification = (type, message, description, options = {}) => {
    api[type]({
      message,
      description,
      duration: 45000,
      ...options,
    });
  };

  const success = (message, description, options = {}) => {
    showNotification('success', message, description, options);
  };

  const info = (message, description, options = {}) => {
    showNotification('info', message, description, options);
  };

  const warning = (message, description, options = {}) => {
    showNotification('warning', message, description, options);
  };

  const error = (message, description, options = {}) => {
    showNotification('error', message, description, options);
  };

  const destroy = () => {
    api.destroy();
  };

  return {
    contextHolder,
    success,
    info,
    warning,
    error,
    destroy,
    api, // Expose the raw API for advanced usage
  };
};

export default useNotification;