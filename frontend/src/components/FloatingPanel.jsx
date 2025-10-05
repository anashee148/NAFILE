import React, { useState } from 'react';
import './FloatingPanel.css';
import MetricsCard from './MetricsCard';
import EnvironmentalCard from './EnvironmentalCard';
import PlanImpactCard from './PlanImpactCard';
import InterventionsSection from './InterventionsSection';
import ProcessingOverlay from './ProcessingOverlay';

const FloatingPanel = ({ 
  scenario, 
  onScenarioChange, 
  simulationData, 
  loading, 
  simulationStep,
  onRunSimulation,
  onLoadPlan,
  uploadedFileName,
  backendStatus,
  earthEngineStatus,
  isVisible,
  onToggle,
  onMinimize
}) => {
  const [activeTab, setActiveTab] = useState('simulation');

  if (!isVisible) return null;

  return (
    <div className="floating-panel-overlay">
      <div className="floating-panel">
        <div className="panel-header">
          <div className="panel-header-left">
            <img src="/nasa-logo.svg" alt="NASA Space Apps" className="panel-logo" />
            <div className="panel-title">
              <h1>UrbanAI</h1>
              <span>Climate-Adaptive Digital Twin</span>
            </div>
          </div>
          <div className="panel-header-controls">
            <button className="panel-control minimize" onClick={onMinimize} title="Minimize">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="panel-control close" onClick={onToggle} title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="panel-tabs">
          <button 
            className={`panel-tab ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </span>
            Simulation
          </button>
          <button 
            className={`panel-tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
            disabled={!simulationData}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"></path>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
              </svg>
            </span>
            Analysis
          </button>
          <button 
            className={`panel-tab ${activeTab === 'solutions' ? 'active' : ''}`}
            onClick={() => setActiveTab('solutions')}
            disabled={!simulationData}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </span>
            Solutions
          </button>
        </div>

        <div className="panel-content">
          {activeTab === 'simulation' && (
            <div className="tab-content">
              <div className="section">
                <h3>System Status</h3>
                <div className="status-grid">
                  <div className={`status-item ${backendStatus === 'connected' ? 'connected' : 'error'}`}>
                    <span className="status-label">Backend API</span>
                    <span className="status-value">
                      {backendStatus === 'connected' ? 'Connected' : 
                       backendStatus === 'checking' ? 'Checking...' : 'Offline'}
                    </span>
                  </div>
                  <div className={`status-item ${earthEngineStatus === 'connected' ? 'connected' : 'warning'}`}>
                    <span className="status-label">Earth Engine</span>
                    <span className="status-value">
                      {earthEngineStatus === 'connected' ? 'Authenticated' : 
                       earthEngineStatus === 'needs_auth' ? 'Need Auth' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="section">
                <h3>Area Selection</h3>
                <div className="plan-upload">
                  <div className="current-plan">
                    <span className="plan-label">Current Area:</span>
                    <span className="plan-name">{uploadedFileName.replace('.geojson', '').replace('_area', '')}</span>
                  </div>
                  <button className="btn-primary" onClick={onLoadPlan}>
                    Upload New Area
                  </button>
                </div>
              </div>
              
              <div className="section">
                <h3>NASA Data Analysis</h3>
                {loading ? (
                  <div className="processing-steps">
                    <div className={`processing-step ${simulationStep === 'processing' ? 'active' : simulationStep && simulationStep !== 'processing' ? 'completed' : 'pending'}`}>
                      <div className="step-indicator">
                        {simulationStep === 'processing' ? (
                          <div className="spinner-small"></div>
                        ) : simulationStep && simulationStep !== 'processing' ? '✓' : '1'}
                      </div>
                      <div className="step-content">
                        <span className="step-title">Area Processing</span>
                        <span className="step-desc">Analyzing geometry bounds</span>
                      </div>
                    </div>
                    
                    <div className={`processing-step ${simulationStep === 'climate' ? 'active' : (simulationStep === 'ai' || (simulationStep && simulationStep !== 'processing' && simulationStep !== 'climate')) ? 'completed' : 'pending'}`}>
                      <div className="step-indicator">
                        {simulationStep === 'climate' ? (
                          <div className="spinner-small"></div>
                        ) : (simulationStep === 'ai' || (simulationStep && simulationStep !== 'processing' && simulationStep !== 'climate')) ? '✓' : '2'}
                      </div>
                      <div className="step-content">
                        <span className="step-title">NASA Satellite Data</span>
                        <span className="step-desc">Processing 6 datasets via Earth Engine</span>
                      </div>
                    </div>
                    
                    <div className={`processing-step ${simulationStep === 'ai' ? 'active' : 'pending'}`}>
                      <div className="step-indicator">
                        {simulationStep === 'ai' ? (
                          <div className="spinner-small"></div>
                        ) : '3'}
                      </div>
                      <div className="step-content">
                        <span className="step-title">AI Recommendations</span>
                        <span className="step-desc">Generating local insights</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="btn-analysis"
                    onClick={onRunSimulation}
                    disabled={backendStatus !== 'connected'}
                  >
                    Run NASA Analysis
                  </button>
                )}
              </div>

              {simulationData && (
                <div className="section">
                  <h3>Climate Scenarios</h3>
                  <div className="scenario-controls">
                    <button 
                      className={`scenario-btn ${scenario === 'baseline' ? 'active' : ''}`}
                      onClick={() => onScenarioChange('baseline')}
                      disabled={loading}
                    >
                      Current Climate
                    </button>
                    <button 
                      className={`scenario-btn ${scenario === 'rcp45' ? 'active' : ''}`}
                      onClick={() => onScenarioChange('rcp45')}
                      disabled={loading}
                    >
                      +2°C Scenario
                    </button>
                    <button 
                      className={`scenario-btn ${scenario === 'rcp45_rain_plus10' ? 'active' : ''}`}
                      onClick={() => onScenarioChange('rcp45_rain_plus10')}
                      disabled={loading}
                    >
                      +10% Rainfall
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && simulationData && (
            <div className="tab-content analysis-grid">
              <div className="analysis-row">
                <MetricsCard 
                  metrics={simulationData.metrics}
                  scenario={scenario}
                  loading={loading}
                />
                <EnvironmentalCard 
                  metrics={simulationData.metrics}
                  loading={loading}
                />
              </div>
              <PlanImpactCard 
                simulationData={simulationData}
                scenario={scenario}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'solutions' && simulationData && (
            <div className="tab-content">
              <div className="solutions-full-width">
                <InterventionsSection 
                  interventions={simulationData.interventions}
                  loading={loading}
                />
              </div>
              <div className="impact-section">
                <PlanImpactCard data={simulationData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;