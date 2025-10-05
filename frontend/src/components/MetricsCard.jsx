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
          <span className="metric-label">Risk Level:</span>
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