import React from 'react';
import Header from './Header';
import PlanSection from './PlanSection';
import SimulationSection from './SimulationSection';
import ScenarioControls from './ScenarioControls';
import MetricsCard from './MetricsCard';
import InterventionsSection from './InterventionsSection';
import DataSourcesSection from './DataSourcesSection';

const ControlPanel = ({ 
  scenario, 
  onScenarioChange, 
  simulationData, 
  loading, 
  onRunSimulation,
  onLoadPlan 
}) => {
  return (
    <div className="control-panel">
      <Header />
      
      <PlanSection onLoadPlan={onLoadPlan} />
      
      <SimulationSection 
        onRunSimulation={onRunSimulation}
        loading={loading}
      />

      {simulationData && (
        <>
          <ScenarioControls 
            scenario={scenario}
            onScenarioChange={onScenarioChange}
          />

          <MetricsCard 
            metrics={simulationData.metrics}
            scenario={scenario}
          />

          <InterventionsSection 
            interventions={simulationData.interventions}
          />
        </>
      )}

      <DataSourcesSection />
    </div>
  );
};

export default ControlPanel;