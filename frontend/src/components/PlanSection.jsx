import React from 'react';

const PlanSection = ({ onLoadPlan, uploadedFileName }) => {
  return (
    <div className="section">
      <h3>🗺️ Analysis Area</h3>
      <button 
        className="btn btn-primary" 
        onClick={onLoadPlan}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        📁 Upload GeoJSON File
      </button>
      
      <div style={{
        marginTop: '10px',
        padding: '8px',
        background: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{fontSize: '10px', color: '#6c757d', marginBottom: '2px'}}>
          Current Location:
        </div>
        <div style={{fontSize: '12px', color: '#2c3e50', fontWeight: 'bold'}}>
          📍 {uploadedFileName}
        </div>
      </div>
      
      <p style={{fontSize: '10px', color: '#7f8c8d', marginTop: '8px', textAlign: 'center'}}>
        Upload any city location file (.geojson)
      </p>
    </div>
  );
};

export default PlanSection;