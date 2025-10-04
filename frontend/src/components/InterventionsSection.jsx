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

const InterventionsSection = ({ interventions }) => {
  if (!interventions || interventions.length === 0) return null;

  return (
    <div className="section">
      <h3>🛠️ Recommended Interventions</h3>
      {interventions.map((intervention, index) => (
        <InterventionCard 
          key={index} 
          intervention={intervention} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default InterventionsSection;