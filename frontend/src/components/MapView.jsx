import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import Legend from './Legend';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MAP_CONFIG = {
  defaultCenter: [13.075, 80.275],
  zoom: 13,
  nasaGibsUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-10-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
};

const mapStyles = {
  plan: {
    color: '#FF6B35',
    weight: 3,
    fillOpacity: 0.1,
    fillColor: '#FF6B35'
  },
  floodRisk: {
    color: '#FF3E41',
    weight: 2,
    fillOpacity: 0.4,
    fillColor: '#FF3E41'
  }
};

const MapView = ({ planData, overlayData, scenario, showOverlay }) => {
  // Calculate center from planData if available
  const getMapCenter = () => {
    if (planData && planData.features && planData.features[0] && planData.features[0].geometry) {
      const coords = planData.features[0].geometry.coordinates[0];
      if (coords && coords.length > 0) {
        const centerLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
        const centerLon = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
        return [centerLat, centerLon];
      }
    }
    return MAP_CONFIG.defaultCenter;
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={getMapCenter()} 
        zoom={MAP_CONFIG.zoom} 
        style={{height: '100%', width: '100%'}}
        key={`map-${JSON.stringify(getMapCenter())}`}
      >
        {/* NASA GIBS Satellite Imagery with OpenStreetMap fallback */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <TileLayer
          url={MAP_CONFIG.nasaGibsUrl}
          attribution="NASA GIBS - Real Satellite Imagery"
          opacity={0.8}
        />
        
        {/* Planning area polygon */}
        {planData && (
          <GeoJSON 
            data={planData} 
            style={mapStyles.plan}
            key="plan-data"
          />
        )}
        
        {/* Real climate analysis overlay */}
        {showOverlay && overlayData && (
          <GeoJSON 
            data={overlayData} 
            style={mapStyles.floodRisk}
            key={`climate-overlay`}
          />
        )}
      </MapContainer>
      <Legend />
    </div>
  );
};

export default MapView;