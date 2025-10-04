import React from 'react';

const DataSourcesSection = () => {
  return (
    <div className="section">
      <h3>📡 Data Sources</h3>
      <div style={{fontSize: '11px', color: '#7f8c8d', lineHeight: '1.4'}}>
        <div>🛰️ NASA GPM IMERG (Precipitation)</div>
        <div>🌍 NASA SMAP (Soil Moisture)</div>
        <div>🗻 SRTM (Digital Elevation)</div>
        <div>👥 WorldPop (Population Density)</div>
        <div>🌃 VIIRS DNB (Nighttime Lights)</div>
        <div>☁️ Google Earth Engine (Processing)</div>
      </div>
    </div>
  );
};

export default DataSourcesSection;