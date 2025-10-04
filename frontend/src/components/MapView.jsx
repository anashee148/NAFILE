import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Legend from './Legend';

const MAP_CONFIG = {
  center: [13.075, 80.275],
  zoom: 14,
  nasaGibsUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-08-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
  fallbackUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

const mapStyles = {
  plan: {
    color: '#FF6B35',
    weight: 3,
    fillOpacity: 0.1,
    fillColor: '#FF6B35'
  },
  baseline: {
    color: '#4ECDC4',
    weight: 2,
    fillOpacity: 0.4,
    fillColor: '#4ECDC4'
  },
  scenarioB: {
    color: '#FF3E41',
    weight: 2,
    fillOpacity: 0.5,
    fillColor: '#FF3E41'
  }
};

const MapView = ({ planData, overlayData, scenario, showOverlay }) => {
  return (
    <div className="map-container">
      <MapContainer 
        center={MAP_CONFIG.center} 
        zoom={MAP_CONFIG.zoom} 
        style={{height: '100%', width: '100%'}}
      >
        {/* Primary NASA GIBS tiles */}
        <TileLayer
          url={MAP_CONFIG.nasaGibsUrl}
          attribution="NASA GIBS"
          errorTileUrl="https://via.placeholder.com/256x256/cccccc/999999?text=NASA+GIBS"
        />
        
        {/* Fallback OpenStreetMap tiles */}
        <TileLayer
          url={MAP_CONFIG.fallbackUrl}
          attribution="© OpenStreetMap contributors"
          opacity={0.3}
        />
        
        {/* Planning area polygon */}
        {planData && (
          <GeoJSON 
            data={planData} 
            style={mapStyles.plan}
            key="plan-data"
          />
        )}
        
        {/* Overlay based on scenario */}
        {showOverlay && overlayData && (
          <GeoJSON 
            data={overlayData} 
            style={scenario === 'baseline' ? mapStyles.baseline : mapStyles.scenarioB}
            key={`overlay-${scenario}`}
          />
        )}
      </MapContainer>
      <Legend />
    </div>
  );
};

export default MapView;