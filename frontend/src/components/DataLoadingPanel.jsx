import React from 'react';

const DataLoadingPanel = ({ backendStatus, earthEngineStatus }) => {
  return (
    <div className="section">
      <h3>📊 System Status</h3>
      
      <div style={{marginBottom: '15px'}}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '12px',
          marginBottom: '8px'
        }}>
          <span>Backend API:</span>
          <span style={{
            color: backendStatus === 'connected' ? '#27ae60' : 
                   backendStatus === 'checking' ? '#f39c12' : '#e74c3c'
          }}>
            {backendStatus === 'connected' ? '🟢 Connected' : 
             backendStatus === 'checking' ? '🟡 Checking...' : '🔴 Offline'}
          </span>
        </div>
        
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '12px',
          marginBottom: '8px'
        }}>
          <span>Earth Engine:</span>
          <span style={{
            color: earthEngineStatus === 'connected' ? '#27ae60' : '#e74c3c'
          }}>
            {earthEngineStatus === 'connected' ? '🟢 Authenticated' : '🔴 Not Auth'}
          </span>
        </div>
        
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '12px'
        }}>
          <span>LMStudio AI:</span>
          <span style={{color: '#27ae60'}}>🟢 Ready</span>
        </div>
      </div>


      
      <div style={{
        marginTop: '10px',
        padding: '8px',
        background: '#e8f5e8',
        borderRadius: '4px',
        fontSize: '10px',
        color: '#2d5a2d'
      }}>
        💡 <strong>How to use:</strong> Click "📁 Load GeoJSON Plan" below to upload any location file, then "🚀 Run Simulation" for real NASA data analysis!
      </div>
    </div>
  );
};

export default DataLoadingPanel;