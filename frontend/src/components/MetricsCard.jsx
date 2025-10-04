import React from 'react';

const MetricsCard = ({ metrics, scenario }) => {
  if (!metrics) return null;

  return (
    <div className="section">
      <h3>📊 Impact Metrics</h3>
      <div className="metrics-card">
        <div className="metric-item">
          <span className="metric-label">Peak Runoff Change:</span>
          <span className="metric-value">+{metrics.peak_runoff_change_pct}%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">People Affected:</span>
          <span className="metric-value">
            {scenario === 'baseline' 
              ? metrics.baseline_people.toLocaleString()
              : metrics.scenarioB_people.toLocaleString()
            }
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Mean Annual Rainfall:</span>
          <span className="metric-value">{metrics.mean_rain_mm}mm</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Risk Level:</span>
          <span className="metric-value" style={{
            color: scenario === 'baseline' ? '#4ECDC4' : '#FF3E41'
          }}>
            {scenario === 'baseline' ? 'Medium' : 'High'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;