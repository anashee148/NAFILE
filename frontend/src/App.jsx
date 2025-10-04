import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import ControlPanel from './components/ControlPanel';
import { samplePlan, baselineOverlay, scenarioBOverlay, mockSimulationData } from './data/mockData';

function App() {
  const [scenario, setScenario] = useState('baseline');
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(samplePlan);
  
  // Auto-load demo data on component mount for immediate display
  useEffect(() => {
    console.log('🚀 UrbanClimate DT loaded with mock data');
    console.log('📍 Plan data:', samplePlan);
    console.log('🌊 Baseline overlay:', baselineOverlay);
    console.log('⛈️ Scenario B overlay:', scenarioBOverlay);
  }, []);

  const handleRunSimulation = async () => {
    setLoading(true);
    // Pure mock simulation - no backend needed
    setTimeout(() => {
      setSimulationData(mockSimulationData);
      setShowOverlay(true);
      setLoading(false);
    }, 2000);
  };

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
  };

  const handleLoadPlan = () => {
    // Mock file loading
    alert('Mock: GeoJSON file loaded! (In real app, this would open file dialog)');
  };

  const getCurrentOverlay = () => {
    if (!showOverlay) return null;
    return scenario === 'baseline' ? baselineOverlay : scenarioBOverlay;
  };

  return (
    <div className="app">
      {/* Mock Demo Status Bar */}
      <div style={{
        position: 'absolute', 
        top: 10, 
        left: 10, 
        zIndex: 1000, 
        background: 'rgba(52, 152, 219, 0.9)', 
        color: 'white', 
        padding: '5px 10px', 
        borderRadius: '4px', 
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        🚀 MOCK DEMO MODE - Space Apps 2025
      </div>

      <MapView 
        planData={currentPlan}
        overlayData={getCurrentOverlay()}
        scenario={scenario}
        showOverlay={showOverlay}
      />

      <ControlPanel 
        scenario={scenario}
        onScenarioChange={handleScenarioChange}
        simulationData={simulationData}
        loading={loading}
        onRunSimulation={handleRunSimulation}
        onLoadPlan={handleLoadPlan}
      />
    </div>
  );
}

export default App;