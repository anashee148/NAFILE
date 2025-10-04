import React from 'react';

const SimulationSection = ({ onRunSimulation, loading }) => {
  return (
    <div className="section">
      <h3>⚡ Simulation</h3>
      <button 
        className="btn btn-primary" 
        onClick={onRunSimulation}
        disabled={loading}
      >
        {loading ? '🔄 Running Simulation...' : '🚀 Run Simulation'}
      </button>
      
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing NASA data and climate scenarios...</p>
        </div>
      )}
    </div>
  );
};

export default SimulationSection;