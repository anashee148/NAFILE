import React from 'react';

const MetricsCard = ({ metrics, scenario, loading }) => {
  if (!metrics) return null;

  // Calculate risk level based on runoff increase
  const runoffIncrease = metrics.peak_runoff_change_pct || 0;
  let riskLevel, riskColor;
  
  if (runoffIncrease <= 10) {
    riskLevel = 'Low';
    riskColor = '#4ECDC4'; // Green
  } else if (runoffIncrease <= 30) {
    riskLevel = 'Medium';
    riskColor = '#FFA500'; // Orange
  } else {
    riskLevel = 'High';
    riskColor = '#FF3E41'; // Red
  }

  // Heat stress color coding
  const getHeatStressColor = (level) => {
    switch(level) {
      case 'Low': return '#4ECDC4';
      case 'Medium': return '#FFA500'; 
      case 'High': return '#FF3E41';
      default: return '#999';
    }
  };

  return (
    <div className="section">
      <h3>📊 Impact Metrics</h3>
      <div className="metrics-card" style={{
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        <div className="metric-item">
          <span className="metric-label">Peak Runoff Change:</span>
          <span className="metric-value">
            {loading ? '🔄' : `+${metrics.peak_runoff_change_pct}%`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">People Affected:</span>
          <span className="metric-value">
            {loading ? '🔄' : 
              scenario === 'baseline' 
                ? (metrics.baseline_people || 0).toLocaleString()
                : (metrics.scenario_people || 0).toLocaleString()
            }
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Mean Annual Rainfall:</span>
          <span className="metric-value">
            {loading ? '🔄' : `${metrics.mean_rain_mm}mm`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Surface Temperature:</span>
          <span className="metric-value">
            {loading ? '🔄' : `${metrics.mean_temperature_c}°C`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Heat Stress:</span>
          <span className="metric-value" style={{
            color: loading ? '#999' : 
              metrics.heat_stress_level === 'Low' ? '#4ECDC4' :
              metrics.heat_stress_level === 'Medium' ? '#FFA500' : '#FF3E41'
          }}>
            {loading ? 'Calculating...' : `${metrics.heat_stress_level} (${(metrics.heat_affected_people || 0).toLocaleString()} people)`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Flood Risk Level:</span>
          <span className="metric-value" style={{
            color: loading ? '#999' : riskColor
          }}>
            {loading ? 'Updating...' : riskLevel}
          </span>
        </div>
      </div>
      {loading && (
        <div style={{
          fontSize: '11px',
          color: '#666',
          textAlign: 'center',
          marginTop: '8px'
        }}>
          ⏳ Recalculating with new scenario...
        </div>
      )}
    </div>
  );
};

export default MetricsCard;