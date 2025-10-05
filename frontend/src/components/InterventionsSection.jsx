import React from 'react';

const InterventionCard = ({ intervention, index }) => {
  return (
    <div className="intervention-card">
      <div className="intervention-title">
        {index + 1}. {intervention.title}
      </div>
      <div className="intervention-desc">
        {intervention.description}
      </div>
      <div className="intervention-details">
        <div>💧 Runoff reduction: {intervention.runoff_reduction_pct}%</div>
        <div>💰 Cost: {intervention.cost_bracket}</div>
        <div>⏱️ Timeline: {intervention.implementation_months} months</div>
        <div>📈 KPI: {intervention.kpi}</div>
        {intervention.contact && (
          <div>📞 Contact: {intervention.contact}</div>
        )}
      </div>
    </div>
  );
};

const InterventionsSection = ({ interventions, loading }) => {
  if (!interventions || interventions.length === 0) return null;

  return (
    <div className="section">
      <h3>🛠️ Recommended Interventions</h3>
      <div style={{
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        {loading ? (
          <div className="intervention-card" style={{
            textAlign: 'center',
            padding: '20px',
            background: '#f8f9fa',
            border: '1px dashed #ccc'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🤖</div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              AI is generating new recommendations...
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              Analyzing scenario data with LMStudio
            </div>
          </div>
        ) : (
          interventions.map((intervention, index) => (
            <InterventionCard 
              key={index} 
              intervention={intervention} 
              index={index} 
            />
          ))
        )}
      </div>
      {loading && (
        <div style={{
          fontSize: '11px',
          color: '#666',
          textAlign: 'center',
          marginTop: '8px'
        }}>
          ⏳ Generating scenario-specific interventions...
        </div>
      )}
    </div>
  );
};

export default InterventionsSection;