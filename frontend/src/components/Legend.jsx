import React from 'react';
import '../legend.css';

const Legend = ({ simulationData, showOverlay, uploadedFileName }) => {
  const getAreaName = () => {
    if (uploadedFileName) {
      return uploadedFileName.replace('.geojson', '').replace('_area', '').replace('_', ' ');
    }
    return 'Current Area';
  };



  return (
    <div className="legend" style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontSize: '12px',
      zIndex: 1000,
      border: '1px solid #ddd',
      minWidth: '180px'
    }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '8px',
        borderBottom: '1px solid #eee',
        paddingBottom: '4px'
      }}>
        📍 {getAreaName()}
      </div>
      
      <div className="legend-item">
        <div className="legend-color" style={{backgroundColor: '#FF6B35'}}></div>
        <span style={{fontSize: '11px', color: '#2c3e50'}}>Analysis Area</span>
      </div>
      
      {showOverlay && simulationData && (
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#FF3E41'}}></div>
          <span style={{fontSize: '11px', color: '#2c3e50'}}>Climate Risk Zone</span>
        </div>
      )}
      
      <div className="legend-item" style={{marginTop: '8px', paddingTop: '4px', borderTop: '1px solid #eee'}}>
        <span style={{fontSize: '10px', color: '#666'}}>
          🛰️ NASA GIBS Satellite
        </span>
      </div>
      
      {simulationData && (
        <div className="legend-item">
          <span style={{fontSize: '10px', color: '#666'}}>
            📊 Real Earth Engine Data
          </span>
        </div>
      )}
    </div>
  );
};

export default Legend;