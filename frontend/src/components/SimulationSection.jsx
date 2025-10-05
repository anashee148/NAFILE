import React from 'react';

const SimulationSection = ({ onRunSimulation, loading, simulationStep }) => {
  const getStepMessage = () => {
    switch(simulationStep) {
      case 'processing': return '🛰️ Processing NASA satellite data...';
      case 'climate': return '🌦️ Analyzing precipitation patterns...';
      case 'elevation': return '🏔️ Processing elevation data...';
      case 'runoff': return '💧 Calculating runoff scenarios...';
      case 'ai': return '🤖 Generating AI recommendations...';
      default: return '🔄 Initializing simulation...';
    }
  };

  return (
    <div className="section">
      <h3>⚡ Climate Simulation</h3>
      <button 
        className="btn btn-primary" 
        onClick={onRunSimulation}
        disabled={loading}
        style={{ width: '100%', padding: '12px', fontSize: '14px' }}
      >
        {loading ? '🔄 Processing...' : '🚀 Run NASA Analysis'}
      </button>
      
      {loading && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#f0f8ff',
          borderRadius: '4px',
          border: '1px solid #cce7ff'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#2c5aa0',
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>
            {getStepMessage()}
          </div>
          <div style={{
            background: '#e6f3ff',
            height: '4px',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#4a90e2',
              height: '100%',
              width: '100%',
              animation: 'loading 2s ease-in-out infinite'
            }}></div>
          </div>
          <div style={{
            fontSize: '10px',
            color: '#666',
            marginTop: '5px'
          }}>
            Real-time processing with Google Earth Engine...
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationSection;