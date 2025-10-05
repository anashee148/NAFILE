import React from 'react';

const Legend = () => {
  return (
    <div className="legend">
      <div className="legend-item">
        <div className="legend-color" style={{backgroundColor: '#FF6B35'}}></div>
        <span>Analysis Area</span>
      </div>
      <div className="legend-item">
        <div className="legend-color" style={{backgroundColor: '#FF3E41'}}></div>
        <span>Climate Risk Zone</span>
      </div>
      <div className="legend-item">
        <span style={{fontSize: '11px', color: '#666'}}>🛰️ NASA GIBS Satellite Imagery</span>
      </div>
    </div>
  );
};

export default Legend;