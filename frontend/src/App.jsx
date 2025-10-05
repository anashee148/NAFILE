import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import ControlPanel from './components/ControlPanel';
// Real data - no more mock imports

function App() {
  const [scenario, setScenario] = useState('baseline');
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulationStep, setSimulationStep] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('Default: Trichy Pilot Ward');
  const [currentPlan, setCurrentPlan] = useState({
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: {name: "Trichy Pilot Ward"},
      geometry: {
        type: "Polygon",
        coordinates: [[[80.27,13.07],[80.28,13.07],[80.28,13.08],[80.27,13.08],[80.27,13.07]]]
      }
    }]
  });
  const [backendStatus, setBackendStatus] = useState('checking');
  const [earthEngineStatus, setEarthEngineStatus] = useState('unknown');
  
  // Check backend and Earth Engine status
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('connected');
        setEarthEngineStatus(data.services.earth_engine ? 'connected' : 'needs_auth');
        console.log('🔌 Backend connected:', data);
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('offline');
      console.error('❌ Backend connection failed. Please start the backend server.');
    }
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    setSimulationStep('processing');
    
    try {
      console.log('🚀 Starting real NASA data simulation...');
      
      // Simulate different processing steps
      setTimeout(() => setSimulationStep('climate'), 1000);
      setTimeout(() => setSimulationStep('elevation'), 2000);
      setTimeout(() => setSimulationStep('runoff'), 3000);
      setTimeout(() => setSimulationStep('ai'), 4000);
      
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          geometry: currentPlan.features[0].geometry,
          scenario: scenario
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 Received real NASA data:', data);
      
      setSimulationData({
        metrics: data.metrics,
        interventions: data.interventions,
        processing_info: data.processing_info
      });
      setShowOverlay(true);
      
    } catch (error) {
      console.error('❌ Simulation failed:', error);
      alert(`❌ Simulation Failed!\n\n${error.message}\n\nPlease ensure:\n1. Backend server is running on localhost:5000\n2. Earth Engine is authenticated\n3. LMStudio is running on localhost:1234`);
      setSimulationData({
        metrics: {
          error: true,
          message: "Please check backend services"
        },
        interventions: []
      });
      setShowOverlay(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
  };

  const handleLoadPlan = () => {
    // Create file input for real GeoJSON upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.geojson,.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const geojson = JSON.parse(event.target.result);
            setCurrentPlan(geojson);
            setSimulationData(null);
            setShowOverlay(false);
            setUploadedFileName(file.name);
            console.log('📁 Loaded new plan:', geojson);
            
            // Show success notification
            alert(`✅ Successfully loaded: ${file.name}\n\nMap will center on the new location. Click "Run NASA Analysis" to process this area.`);
          } catch (error) {
            alert('Invalid GeoJSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getCurrentOverlay = () => {
    if (!showOverlay || !simulationData?.overlays) return null;
    return scenario === 'baseline' ? simulationData.overlays.baseline : simulationData.overlays.scenarioB;
  };

  return (
    <div className="app">
      {/* System Status Bar */}
      <div style={{
        position: 'absolute', 
        top: 10, 
        left: 10, 
        zIndex: 1000, 
        background: backendStatus === 'connected' ? 'rgba(34, 139, 34, 0.9)' : 'rgba(255, 140, 0, 0.9)', 
        color: 'white', 
        padding: '8px 12px', 
        borderRadius: '6px', 
        fontSize: '11px',
        fontWeight: 'bold',
        minWidth: '200px'
      }}>
        <div>🛰️ NASA DATA + AI - Space Apps 2025</div>
        <div style={{fontSize: '9px', marginTop: '2px', opacity: 0.9}}>
          Backend: {backendStatus === 'connected' ? '🟢 Online' : 
                   backendStatus === 'checking' ? '🟡 Checking...' : '🔴 Offline'} | 
          Earth Engine: {earthEngineStatus === 'connected' ? '🟢 Auth' : 
                        earthEngineStatus === 'needs_auth' ? '🟡 Need Auth' : '🔴 Unknown'}
        </div>
        <div style={{fontSize: '8px', marginTop: '2px', opacity: 0.8}}>
          📍 Area: {uploadedFileName.replace('.geojson', '').replace('_area', '')}
        </div>
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
        simulationStep={simulationStep}
        onRunSimulation={handleRunSimulation}
        onLoadPlan={handleLoadPlan}
        uploadedFileName={uploadedFileName}
        backendStatus={backendStatus}
        earthEngineStatus={earthEngineStatus}
      />
    </div>
  );
}

export default App;