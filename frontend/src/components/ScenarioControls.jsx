import React from 'react';

const ScenarioControls = ({ scenario, onScenarioChange, loading }) => {
  return (
    <div className="section">
      <h3>🌡️ Climate Scenarios</h3>
      <div className="scenario-controls">
        <button 
          className={`scenario-btn ${scenario === 'baseline' ? 'active' : ''}`}
          onClick={() => onScenarioChange('baseline')}
          disabled={loading}
        >
          Baseline
        </button>
        <button 
          className={`scenario-btn ${scenario === 'rcp45' ? 'active' : ''}`}
          onClick={() => onScenarioChange('rcp45')}
          disabled={loading}
        >
          +10% Rainfall
        </button>
      </div>
      {loading && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          ⏳ Updating scenario...
        </div>
      )}
    </div>
  );
};

export default ScenarioControls;