import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import FloatingPanel from './components/FloatingPanel';
import FloatingButton from './components/FloatingButton';
import IntroPopup from './components/IntroPopup';
import Toast from './components/Toast';
import MapLegend from './components/MapLegend';
// Real data - no more mock imports

function App() {
  const [scenario, setScenario] = useState(() => {
    return localStorage.getItem('scenario') || 'baseline';
  });
  const [simulationData, setSimulationData] = useState(() => {
    const saved = localStorage.getItem('simulationData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved simulation data:', e);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [simulationStep, setSimulationStep] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(() => {
    return localStorage.getItem('uploadedFileName') || 'Default: Trichy Pilot Ward';
  });
  const [currentPlan, setCurrentPlan] = useState(() => {
    const saved = localStorage.getItem('currentPlan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved plan:', e);
      }
    }
    return {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {name: "Trichy Pilot Ward"},
        geometry: {
          type: "Polygon",
          coordinates: [[[80.27,13.07],[80.28,13.07],[80.28,13.08],[80.27,13.08],[80.27,13.07]]]
        }
      }]
    };
  });
  const [backendStatus, setBackendStatus] = useState('checking');
  const [earthEngineStatus, setEarthEngineStatus] = useState('unknown');
  const [toast, setToast] = useState(null);
  const [showIntroPopup, setShowIntroPopup] = useState(() => {
    return !localStorage.getItem('intro-completed');
  });
  const [panelVisible, setPanelVisible] = useState(() => {
    // Only show panel if intro was already completed
    return localStorage.getItem('intro-completed') === 'true';
  });
  const [panelMinimized, setPanelMinimized] = useState(false);
  
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

      setSimulationStep('climate');
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      setSimulationStep('ai');
      const simulationResult = await response.json();
      
      setSimulationData(simulationResult);
      setShowOverlay(true);
      
      // Save simulation data
      localStorage.setItem('simulationData', JSON.stringify(simulationResult));

      // Show success toast
      setToast({
        message: `Analysis Complete! 🎉\n\nProcessed real NASA data for ${uploadedFileName.replace('.geojson', '')}\nGenerated ${simulationResult.interventions?.length || 3} AI recommendations`,
        type: 'success'
      });
      
    } catch (error) {
      console.error('❌ Simulation failed:', error);
      setToast({
        message: `Simulation Failed!\n\n${error.message}\n\nPlease ensure:\n1. Backend server is running on localhost:5000\n2. Earth Engine is authenticated\n3. LMStudio is running on localhost:1234`,
        type: 'error'
      });
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
      setSimulationStep('');
    }
  };

  const handleScenarioChange = async (newScenario) => {
    setScenario(newScenario);
    localStorage.setItem('scenario', newScenario);
    
    // Re-run simulation with new scenario if we have plan data
    if (currentPlan && simulationData) {
      setLoading(true);
      setSimulationStep('updating');
      
      try {
        console.log(`🔄 Updating to ${newScenario} scenario...`);
        
        const response = await fetch('http://localhost:5000/api/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geometry: currentPlan.features[0].geometry,
            scenario: newScenario
          })
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const simulationResult = await response.json();
        console.log(`📊 New scenario data:`, {
          scenario: simulationResult.scenario,
          runoff_change: simulationResult.metrics?.peak_runoff_change_pct,
          people_affected: simulationResult.metrics?.scenario_people,
          interventions_count: simulationResult.interventions?.length
        });
        setSimulationData(simulationResult);
        
        // Save updated simulation data
        localStorage.setItem('simulationData', JSON.stringify(simulationResult));

        // Show scenario change toast
        setToast({
          message: `Scenario Updated! 📊\n\nNow showing: ${newScenario.toUpperCase()}\nMetrics recalculated with real NASA data`,
          type: 'success'
        });
        
      } catch (error) {
        console.error('❌ Scenario update failed:', error);
        setToast({
          message: `Scenario Update Failed!\n\n${error.message}`,
          type: 'error'
        });
      } finally {
        setLoading(false);
        setSimulationStep('');
      }
    }
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
            
            // Save to localStorage
            localStorage.setItem('currentPlan', JSON.stringify(geojson));
            localStorage.setItem('uploadedFileName', file.name);
            
            console.log('📁 Loaded new plan:', geojson);
            
            // Show success toast
            setToast({
              message: `Successfully loaded: ${file.name}\n\nMap will center on the new location. Click "Run NASA Analysis" to process this area.`,
              type: 'success'
            });
          } catch (error) {
            setToast({
              message: 'Invalid GeoJSON file\n\nPlease select a valid .geojson file with proper coordinates.',
              type: 'error'
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getCurrentOverlay = () => {
    if (!showOverlay || !simulationData) return null;
    
    // For now, return a simple overlay based on the current plan geometry
    // since the backend might not be sending overlay data
    if (simulationData.overlays) {
      return scenario === 'baseline' ? simulationData.overlays.baseline : simulationData.overlays.rcp45;
    }
    
    // Return null if no overlay data - this prevents crashes
    return null;
  };

  const handleIntroComplete = () => {
    setShowIntroPopup(false);
    localStorage.setItem('intro-completed', 'true');
    setPanelVisible(true);
    setPanelMinimized(false);
  };

  const handlePanelToggle = () => {
    setPanelVisible(!panelVisible);
    setPanelMinimized(false);
  };

  const handlePanelMinimize = () => {
    setPanelVisible(false);
    setPanelMinimized(true);
  };



  return (
    <div className="app">
      {/* System Status Bar */}
      <div style={{
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 1000, 
        background: backendStatus === 'connected' ? 'rgba(34, 139, 34, 0.9)' : 'rgba(255, 140, 0, 0.9)', 
        color: 'white', 
        padding: '8px 12px', 
        borderRadius: '6px', 
        fontSize: '11px',
        fontWeight: 'bold',
        minWidth: '200px'
      }}>
        <div>NASA EARTH ENGINE + AI - Space Apps 2025</div>
        <div style={{fontSize: '9px', marginTop: '2px', opacity: 0.9}}>
          Backend: {backendStatus === 'connected' ? 'Online' : 
                   backendStatus === 'checking' ? 'Checking...' : 'Offline'} | 
          Earth Engine: {earthEngineStatus === 'connected' ? 'Authenticated' : 
                        earthEngineStatus === 'needs_auth' ? 'Auth Required' : 'Unknown'}
        </div>
        <div style={{fontSize: '8px', marginTop: '2px', opacity: 0.8}}>
          Area: {uploadedFileName.replace('.geojson', '').replace('_area', '')}
        </div>
      </div>

      <MapView 
        planData={currentPlan}
        overlayData={getCurrentOverlay()}
        scenario={scenario}
        showOverlay={showOverlay}
        simulationData={simulationData}
        uploadedFileName={uploadedFileName}
      />

      {showIntroPopup && (
        <IntroPopup onComplete={handleIntroComplete} />
      )}

      {panelVisible && (
        <FloatingPanel 
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
          isVisible={panelVisible}
          onToggle={handlePanelToggle}
          onMinimize={handlePanelMinimize}
        />
      )}

      {(!panelVisible && !showIntroPopup) && (
        <FloatingButton
          onClick={handlePanelToggle}
          simulationData={simulationData}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <MapLegend 
        uploadedFileName={uploadedFileName}
        simulationData={simulationData}
      />
    </div>
  );
}

export default App;