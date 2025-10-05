import React from 'react';
import Header from './Header';
import PlanSection from './PlanSection';
import SimulationSection from './SimulationSection';
import ScenarioControls from './ScenarioControls';
import MetricsCard from './MetricsCard';
import EnvironmentalCard from './EnvironmentalCard';
import PlanImpactCard from './PlanImpactCard';
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
            loading={loading}
          />

          <MetricsCard 
            metrics={simulationData.metrics}
            scenario={scenario}
            loading={loading}
          />

          <EnvironmentalCard 
            metrics={simulationData.metrics}
            loading={loading}
          />

          <PlanImpactCard 
            simulationData={simulationData}
            scenario={scenario}
            loading={loading}
          />

          <InterventionsSection 
            interventions={simulationData.interventions}
            loading={loading}
          />
        </>
      )}

      <DataSourcesSection />
    </div>
  );
};

export default ControlPanel;