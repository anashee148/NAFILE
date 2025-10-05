import React from 'react';
import './FloatingButton.css';

const FloatingButton = ({ onClick, simulationData }) => {
  return (
    <button className="floating-button" onClick={onClick} title="Open UrbanAI Panel">
      <div className="floating-button-content">
        <img src="/nasa-logo.svg" alt="NASA Space Apps" className="floating-button-logo" />
        <div className="floating-button-text">
          <span className="floating-button-title">UrbanAI</span>
          {simulationData && (
            <span className="floating-button-status">Analysis Ready</span>
          )}
        </div>
      </div>
      {simulationData && <div className="floating-button-indicator"></div>}
    </button>
  );
};

export default FloatingButton;