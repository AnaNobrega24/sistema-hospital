// src/components/Alert.jsx
import React, { useEffect } from 'react';

export default function Alert({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'border-green-500 text-green-700',
    error: 'border-red-500 text-red-700',
    info: 'border-blue-500 text-blue-700'
  };

  const icons = {
    success: 'fas fa-check-circle text-green-500',
    error: 'fas fa-times-circle text-red-500',
    info: 'fas fa-info-circle text-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 bg-white border-l-4 ${colors[type]} rounded-lg shadow-lg p-4 z-50 max-w-sm`}>
      <div className="flex items-center">
        <i className={`${icons[type]} mr-3`}></i>
        <p>{message}</p>
      </div>
    </div>
  );
}
