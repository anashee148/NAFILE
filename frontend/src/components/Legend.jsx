import React from 'react';

const Legend = () => {
  return (
    <div className="legend">
      <div className="legend-item">
        <div className="legend-color" style={{backgroundColor: '#FF6B35'}}></div>
        <span>Planning Area</span>
      </div>
      <div className="legend-item">
        <div className="legend-color" style={{backgroundColor: '#4ECDC4'}}></div>
        <span>Baseline Flood Risk</span>
      </div>
      <div className="legend-item">
        <div className="legend-color" style={{backgroundColor: '#FF3E41'}}></div>
        <span>Climate Scenario (+10%)</span>
      </div>
    </div>
  );
};

export default Legend;