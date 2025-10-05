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
      backdropFilter: 'blur(20px)',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(7, 23, 63, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
      fontSize: '12px',
      zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.3)',
      minWidth: '200px'
    }}>
      <div style={{
        fontSize: '12px',
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: '700',
        color: '#07173F',
        marginBottom: '10px',
        borderBottom: '2px solid rgba(7, 23, 63, 0.1)',
        paddingBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {getAreaName()}
      </div>
      
      <div className="legend-item">
        <div className="legend-color" style={{backgroundColor: '#2E96F5'}}></div>
        <span style={{
          fontSize: '11px', 
          color: '#07173F',
          fontFamily: 'Overpass, sans-serif',
          fontWeight: '600'
        }}>Analysis Area</span>
      </div>
      
      {showOverlay && simulationData && (
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#E43700'}}></div>
          <span style={{
            fontSize: '11px', 
            color: '#07173F',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: '600'
          }}>Climate Risk Zone</span>
        </div>
      )}
      
      <div className="legend-item" style={{marginTop: '10px', paddingTop: '6px', borderTop: '1px solid rgba(7, 23, 63, 0.1)'}}>
        <span style={{
          fontSize: '10px', 
          color: '#0042A6',
          fontFamily: 'Overpass, sans-serif',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          NASA GIBS Satellite
        </span>
      </div>
      
      {simulationData && (
        <div className="legend-item">
          <span style={{
            fontSize: '10px', 
            color: '#0042A6',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            Real Earth Engine Data
          </span>
        </div>
      )}
    </div>
  );
};

export default Legend;