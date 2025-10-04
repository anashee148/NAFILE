import React from 'react';

const PlanSection = ({ onLoadPlan }) => {
  return (
    <div className="section">
      <h3>🗺️ Urban Plan</h3>
      <button className="btn btn-secondary" onClick={onLoadPlan}>
        📁 Load GeoJSON Plan
      </button>
      <p style={{fontSize: '12px', color: '#7f8c8d', marginTop: '8px'}}>
        Current: Trichy Pilot Ward
      </p>
    </div>
  );
};

export default PlanSection;