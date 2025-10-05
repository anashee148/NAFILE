import React from 'react';
import Header from './Header';
import PlanSection from './PlanSection';
import SimulationSection from './SimulationSection';
import ScenarioControls from './ScenarioControls';
import MetricsCard from './MetricsCard';
import InterventionsSection from './InterventionsSection';
import DataSourcesSection from './DataSourcesSection';
import DataLoadingPanel from './DataLoadingPanel';

const ControlPanel = ({ 
  scenario, 
  onScenarioChange, 
  simulationData, 
  loading, 
  simulationStep,
  onRunSimulation,
  onLoadPlan,
  uploadedFileName,
  backendStatus,
  earthEngineStatus 
}) => {
  return (
    <div className="control-panel">
      <Header />
      
      <DataLoadingPanel 
        backendStatus={backendStatus}
        earthEngineStatus={earthEngineStatus}
      />
      
      <PlanSection onLoadPlan={onLoadPlan} uploadedFileName={uploadedFileName} />
      
      <SimulationSection 
        onRunSimulation={onRunSimulation}
        loading={loading}
        simulationStep={simulationStep}
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