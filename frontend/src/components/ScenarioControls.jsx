import React from 'react';

const ScenarioControls = ({ scenario, onScenarioChange }) => {
  return (
    <div className="section">
      <h3>🌡️ Climate Scenarios</h3>
      <div className="scenario-controls">
        <button 
          className={`scenario-btn ${scenario === 'baseline' ? 'active' : ''}`}
          onClick={() => onScenarioChange('baseline')}
        >
          Baseline
        </button>
        <button 
          className={`scenario-btn ${scenario === 'rcp45' ? 'active' : ''}`}
          onClick={() => onScenarioChange('rcp45')}
        >
          +10% Rainfall
        </button>
      </div>
    </div>
  );
};

export default ScenarioControls;