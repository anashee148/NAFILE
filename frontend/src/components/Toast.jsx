import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getColor = () => {
    switch(type) {
      case 'success': return '#d4edda';
      case 'error': return '#f8d7da';
      case 'info': return '#d1ecf1';
      default: return '#e2e3e5';
    }
  };

  const getBorderColor = () => {
    switch(type) {
      case 'success': return '#c3e6cb';
      case 'error': return '#f5c6cb';
      case 'info': return '#bee5eb';
      default: return '#d6d8db';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      background: getColor(),
      border: `1px solid ${getBorderColor()}`,
      borderRadius: '8px',
      padding: '12px 16px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px'
      }}>
        <span style={{ fontSize: '16px' }}>{getIcon()}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#2c3e50',
            whiteSpace: 'pre-line'
          }}>
            {message}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#6c757d',
            padding: '0',
            marginLeft: '8px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;