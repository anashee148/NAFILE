import React from 'react';

const MetricsCard = ({ metrics, scenario, loading }) => {
  if (!metrics) return null;

  // Calculate risk level based on runoff increase
  const runoffIncrease = metrics.peak_runoff_change_pct || 0;
  let riskLevel, riskColor;
  
  if (runoffIncrease <= 10) {
    riskLevel = 'Low';
    riskColor = '#2E96F5'; // NASA Blue
  } else if (runoffIncrease <= 30) {
    riskLevel = 'Medium';
    riskColor = '#EAFE07'; // NASA Yellow
  } else {
    riskLevel = 'High';
    riskColor = '#E43700'; // NASA Red
  }

  // Heat stress color coding
  const getHeatStressColor = (level) => {
    switch(level) {
      case 'Low': return '#2E96F5';
      case 'Medium': return '#EAFE07'; 
      case 'High': return '#E43700';
      default: return '#999';
    }
  };

  return (
    <div className="section">
      <h3>Impact Metrics</h3>
      <div className="metrics-card" style={{
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        <div className="metric-item">
          <span className="metric-label">Peak Runoff Change:</span>
          <span className="metric-value">
            {loading ? 'Calculating...' : `+${metrics.peak_runoff_change_pct}%`}
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
            {loading ? 'Loading...' : `${metrics.mean_rain_mm}mm`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Surface Temperature:</span>
          <span className="metric-value">
            {loading ? 'Loading...' : `${metrics.mean_temperature_c}°C`}
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
          Recalculating with new scenario...
        </div>
      )}
    </div>
  );
};

export default MetricsCard;