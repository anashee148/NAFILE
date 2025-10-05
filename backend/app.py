from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import ee
import os
from datetime import datetime, timedelta
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LMStudio configuration
LMSTUDIO_URL = os.getenv('LMSTUDIO_URL', 'http://localhost:1234')

class LMStudioService:
    def __init__(self, base_url=LMSTUDIO_URL):
        self.base_url = base_url
    
    def generate_recommendations(self, metrics):
        """Generate policy recommendations using local LMStudio LLM"""
        
        # Dynamic location context based on coordinates
        location_context = self._get_location_context(metrics.get('coordinates', [80.27, 13.07]))
        
        # Add randomness to avoid repetitive responses
        import random
        focus_areas = [
            "green infrastructure and permeable surfaces",
            "drainage system improvements and stormwater management", 
            "community resilience and early warning systems",
            "sustainable development and flood-resistant building codes"
        ]
        focus = random.choice(focus_areas)
        
        # Add scenario-specific urgency context
        scenario_context = {
            'baseline': "current conditions with moderate climate risks",
            'rcp45': "increased rainfall scenario requiring proactive measures", 
            'rcp85': "high-impact climate scenario needing urgent interventions"
        }
        urgency = scenario_context.get(metrics.get('scenario', 'baseline'), "moderate risk scenario")
        
        prompt = f"""You are an expert urban planner analyzing {location_context['region']} under {urgency}. 

REAL CLIMATE DATA:
- Peak runoff change: +{metrics.get('peak_runoff_change_pct', 45)}%
- People affected: {metrics.get('people_affected', 2100):,}
- Area: {metrics.get('area_ha', 100)} hectares  
- Mean rainfall: {metrics.get('mean_rain_mm', 1250)}mm
- Scenario: {metrics.get('scenario', 'baseline')} ({urgency})

LOCATION CONTEXT: {location_context['description']}

Focus on {focus}. For {metrics.get('scenario', 'baseline')} scenario, generate exactly 3 specific, implementable urban planning interventions:

Generate exactly 3 prioritized urban planning interventions in JSON format:

{{
  "interventions": [
    {{
      "title": "intervention name",
      "description": "1-2 sentence description",
      "runoff_reduction_pct": number,
      "cost_bracket": "Low/Medium/High (₹X-Y lakhs)",
      "implementation_months": number,
      "kpi": "monitoring indicator",
      "contact": "municipal department"
    }}
  ]
}}

Focus on flood mitigation, use Indian Rupee costs, and include realistic timelines."""

        try:
            response = requests.post(
                f"{self.base_url}/v1/chat/completions", 
                json={
                    "model": "qwen2.5-coder-7b-instruct",
                    "messages": [
                        {"role": "system", "content": "You are an expert urban planner. Generate exactly 3 urban planning interventions in valid JSON format only. No additional text."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.3
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                text = result['choices'][0]['message']['content'].strip()
                
                # Try to parse JSON response
                try:
                    # Remove markdown code blocks if present
                    if text.startswith('```json'):
                        text = text.replace('```json', '').replace('```', '').strip()
                    elif text.startswith('```'):
                        text = text.replace('```', '').strip()
                    
                    parsed_json = json.loads(text)
                    return parsed_json
                except json.JSONDecodeError as e:
                    logger.error(f"JSON parsing failed: {e}, Response: {text}")
                    raise Exception(f"LMStudio returned invalid JSON: {text[:200]}...")
            else:
                raise Exception(f"LMStudio API error {response.status_code}: {response.text}")
                
        except Exception as e:
            logger.error(f"LMStudio connection failed: {e}")
            raise Exception(f"LMStudio connection failed: {str(e)}. Please ensure LMStudio is running on localhost:1234")
    
    def _get_location_context(self, coordinates):
        """Get location-specific context based on coordinates"""
        lon, lat = coordinates[0], coordinates[1]
        
        # Indian city regions based on coordinates
        if 79.5 < lon < 81.5 and 12.5 < lat < 14.5:
            return {"region": "Tamil Nadu (Chennai/Trichy region)", "description": "Coastal plains with monsoon flooding risks, urban heat islands, and cyclone exposure"}
        elif 72.5 < lon < 73.5 and 18.5 < lat < 19.5:
            return {"region": "Maharashtra (Mumbai region)", "description": "Coastal metropolis with extreme monsoon rainfall, waterlogging, and high population density"}
        elif 77.0 < lon < 78.0 and 28.0 < lat < 29.0:
            return {"region": "Delhi NCR", "description": "River floodplains with urban sprawl, air pollution, and extreme weather events"}
        elif 88.0 < lon < 89.0 and 22.0 < lat < 23.0:
            return {"region": "West Bengal (Kolkata region)", "description": "Delta region with tidal flooding, cyclones, and dense urban settlements"}
        elif 77.0 < lon < 78.0 and 12.5 < lat < 13.5:
            return {"region": "Karnataka (Bangalore region)", "description": "Elevated plateau with lake systems, rapid urbanization, and groundwater depletion"}
        else:
            return {"region": "Indian urban area", "description": "Urban area with climate vulnerabilities and development pressures"}

class EarthEngineService:
    def __init__(self):
        self.initialized = False
        self._initialize_ee()
    
    def _initialize_ee(self):
        """Initialize Google Earth Engine"""
        try:
            # Use service account credentials
            from google.oauth2 import service_account
            
            # Load service account credentials
            credentials = service_account.Credentials.from_service_account_file(
                '../service-account-key.json',  # Go up one directory from backend/
                scopes=['https://www.googleapis.com/auth/earthengine']
            )
            
            # Initialize Earth Engine with service account
            ee.Initialize(credentials=credentials, project='urbanclimate-demo')
            self.initialized = True
            logger.info("Earth Engine initialized successfully with service account")
                    
        except Exception as e:
            logger.error(f"Earth Engine authentication failed: {e}")
            self.initialized = False
    
    def process_climate_data(self, geometry, start_date='2020-01-01', end_date='2024-12-31'):
        """Process real NASA climate data for the given geometry"""
        if not self.initialized:
            raise Exception("Earth Engine not authenticated. Please run: earthengine authenticate")
        
        try:
            # Convert geometry to Earth Engine geometry
            ee_geometry = ee.Geometry.Polygon(geometry['coordinates'])
            
            # GPM IMERG precipitation data
            gpm = ee.ImageCollection('NASA/GPM_L3/IMERG_V06') \
                    .filterDate(start_date, end_date) \
                    .select('precipitationCal')
            mean_precipitation = gpm.mean().clip(ee_geometry)
            
            # SRTM elevation data
            srtm = ee.Image('USGS/SRTMGL1_003').select('elevation').clip(ee_geometry)
            
            # Get statistics
            precip_stats = mean_precipitation.reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=ee_geometry,
                scale=1000,
                maxPixels=1e9
            ).getInfo()
            
            elevation_stats = srtm.reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=ee_geometry, 
                scale=30,
                maxPixels=1e9
            ).getInfo()
            
            return {
                'mean_precipitation_mm': precip_stats.get('precipitationCal', 1250) * 365,  # Annual
                'mean_elevation_m': elevation_stats.get('elevation', 85),
                'geometry_area_ha': ee_geometry.area().divide(10000).getInfo(),
                'data_source': 'real_nasa_data',
                'processing_date': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Earth Engine processing failed: {e}")
            raise Exception(f"NASA data processing failed: {e}. Please ensure Earth Engine is authenticated.")
    


def scs_runoff_calculation(precipitation_mm, curve_number, area_ha):
    """
    SCS Curve Number method for runoff calculation
    Based on USDA Natural Resources Conservation Service standards
    """
    # Potential maximum retention (mm)
    S = (25400.0 / curve_number) - 254.0
    
    # Initial abstraction (mm)
    Ia = 0.2 * S
    
    # Direct runoff calculation
    if precipitation_mm <= Ia:
        runoff_depth = 0.0
    else:
        runoff_depth = ((precipitation_mm - Ia)**2) / (precipitation_mm - Ia + S)
    
    # Convert to volume
    area_m2 = area_ha * 10000
    runoff_volume_m3 = (runoff_depth / 1000.0) * area_m2
    
    # Simplified peak flow calculation (m³/s)
    # Using rational method approximation
    peak_flow_m3s = runoff_volume_m3 / 3600  # Assumes 1-hour concentration time
    
    return {
        "runoff_depth_mm": round(runoff_depth, 2),
        "runoff_volume_m3": round(runoff_volume_m3, 2),
        "peak_flow_m3s": round(peak_flow_m3s, 3)
    }

# Initialize services
llm_service = LMStudioService()
ee_service = EarthEngineService()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Comprehensive health check endpoint"""
    # Check LMStudio
    lmstudio_status = False
    try:
        # Use the correct models endpoint
        lm_response = requests.get(f"{LMSTUDIO_URL}/v1/models", timeout=3)
        lmstudio_status = lm_response.status_code == 200
    except:
        lmstudio_status = False
    
    return jsonify({
        "status": "healthy" if (ee_service.initialized and lmstudio_status) else "degraded",
        "services": {
            "earth_engine": {
                "status": "connected" if ee_service.initialized else "authentication_required",
                "message": "Ready for NASA data processing" if ee_service.initialized else "Run: earthengine authenticate"
            },
            "lmstudio": {
                "status": "connected" if lmstudio_status else "offline",
                "url": LMSTUDIO_URL,
                "message": "AI recommendations ready" if lmstudio_status else "Start LMStudio server on localhost:1234"
            }
        },
        "timestamp": datetime.now().isoformat()
    })

# Cache for Earth Engine data to avoid repeated processing
climate_data_cache = {}
# Cache for complete simulation results (geometry + scenario specific)
simulation_cache = {}
MAX_CACHE_SIZE = 10  # Limit cache to prevent memory issues

def get_geometry_hash(geometry):
    """Create a hash key for geometry to use as cache key"""
    import json
    import hashlib
    geom_str = json.dumps(geometry, sort_keys=True)
    return hashlib.md5(geom_str.encode()).hexdigest()

def manage_cache():
    """Keep cache size manageable"""
    if len(climate_data_cache) > MAX_CACHE_SIZE:
        # Remove oldest entry (simple FIFO)
        oldest_key = next(iter(climate_data_cache))
        del climate_data_cache[oldest_key]
        logger.info(f"Climate cache cleanup: removed {oldest_key}")
    
    if len(simulation_cache) > MAX_CACHE_SIZE * 3:  # Allow more simulation cache entries
        oldest_key = next(iter(simulation_cache))
        del simulation_cache[oldest_key]
        logger.info(f"Simulation cache cleanup: removed {oldest_key}")

def get_simulation_cache_key(geometry_hash, scenario):
    """Create cache key for complete simulation results"""
    return f"{geometry_hash}_{scenario}"

@app.route('/api/cache/clear', methods=['POST'])
def clear_cache():
    """Clear all caches"""
    global climate_data_cache, simulation_cache
    climate_data_cache.clear()
    simulation_cache.clear()
    return jsonify({"status": "success", "message": "All caches cleared"})

@app.route('/api/cache/status', methods=['GET'])
def cache_status():
    """Get cache status"""
    return jsonify({
        "climate_cache_size": len(climate_data_cache),
        "simulation_cache_size": len(simulation_cache),
        "cached_geometries": list(climate_data_cache.keys()),
        "cached_simulations": list(simulation_cache.keys())
    })

@app.route('/api/simulate', methods=['POST'])
def simulate_climate_impact():
    """Main simulation endpoint with real NASA data processing"""
    try:
        data = request.get_json()
        geometry = data.get('geometry', {
            'type': 'Polygon',
            'coordinates': [[[80.27,13.07],[80.28,13.07],[80.28,13.08],[80.27,13.08],[80.27,13.07]]]
        })
        scenario = data.get('scenario', 'baseline')
        
        logger.info(f"Processing simulation for scenario: {scenario}")
        
        # Check if we have cached complete simulation results
        geometry_hash = get_geometry_hash(geometry)
        simulation_cache_key = get_simulation_cache_key(geometry_hash, scenario)
        
        if simulation_cache_key in simulation_cache:
            logger.info(f"🚀 Super fast: Using cached complete simulation for {scenario}")
            cached_result = simulation_cache[simulation_cache_key]
            # Update timestamp but return cached data
            cached_result["processing_info"]["cache_hit"] = True
            cached_result["processing_info"]["processing_time"] = datetime.now().isoformat()
            return jsonify(cached_result)
        
        # Check if we have cached Earth Engine data for this geometry
        if geometry_hash in climate_data_cache:
            logger.info("⚡ Fast scenario: Using cached NASA Earth Engine data")
            climate_data = climate_data_cache[geometry_hash]
        else:
            logger.info("🛰️ New geometry: Processing NASA Earth Engine data")
            # Get real NASA climate data (only when geometry changes)
            climate_data = ee_service.process_climate_data(geometry)
            # Cache the result
            climate_data_cache[geometry_hash] = climate_data
        
        # Calculate baseline runoff using SCS method
        # Urban area assumption: CN = 85 (residential, moderate density)
        baseline_cn = 85
        baseline_precipitation = climate_data['mean_precipitation_mm']
        area_ha = climate_data['geometry_area_ha']
        
        baseline_runoff = scs_runoff_calculation(
            baseline_precipitation, baseline_cn, area_ha
        )
        
        # Calculate scenario runoff
        scenario_multipliers = {
            'baseline': 1.0,
            'rcp45': 1.1,    # +10% rainfall
            'rcp85': 1.2     # +20% rainfall
        }
        
        multiplier = scenario_multipliers.get(scenario, 1.0)
        scenario_precipitation = baseline_precipitation * multiplier
        scenario_runoff = scs_runoff_calculation(
            scenario_precipitation, baseline_cn, area_ha
        )
        
        # Calculate population impact (simplified)
        # Assume population density of 5000 people/km² for Trichy urban area
        population_density_per_ha = 50  # people per hectare
        total_population = int(area_ha * population_density_per_ha)
        
        # Risk exposure percentages based on runoff increase
        runoff_increase = ((scenario_runoff['runoff_depth_mm'] / max(baseline_runoff['runoff_depth_mm'], 1)) - 1) * 100
        
        if runoff_increase <= 10:
            risk_factor = 0.05  # 5% population at risk
        elif runoff_increase <= 30:
            risk_factor = 0.15  # 15% population at risk  
        else:
            risk_factor = 0.35  # 35% population at risk
            
        people_affected = int(total_population * risk_factor)
        
        # Debug logging (after calculations)
        logger.info(f"Scenario: {scenario}, Multiplier: {multiplier}")
        logger.info(f"Base precipitation: {baseline_precipitation:.1f}mm, Scenario precipitation: {scenario_precipitation:.1f}mm")
        logger.info(f"Runoff increase: {runoff_increase:.1f}%, People affected: {people_affected}")
        
        # Get center coordinates for location context
        center_coords = geometry['coordinates'][0]
        center_lat = sum(coord[1] for coord in center_coords) / len(center_coords)
        center_lon = sum(coord[0] for coord in center_coords) / len(center_coords)
        
        # Prepare metrics for LLM
        metrics = {
            'peak_runoff_change_pct': round(runoff_increase, 1),
            'people_affected': people_affected,
            'area_ha': area_ha,
            'mean_rain_mm': round(climate_data['mean_precipitation_mm'], 0),
            'scenario': scenario,
            'coordinates': [center_lon, center_lat]
        }
        
        # Generate AI recommendations
        recommendations = llm_service.generate_recommendations(metrics)
        
        # Generate dynamic overlays based on real calculations
        center_coords = geometry['coordinates'][0]
        center_lat = sum(coord[1] for coord in center_coords) / len(center_coords)
        center_lon = sum(coord[0] for coord in center_coords) / len(center_coords)
        
        # Create baseline inundation area (conservative)
        baseline_buffer = 0.001  # Small buffer for baseline
        baseline_overlay = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {
                    "name": "baseline-inundation",
                    "risk_level": "medium",
                    "depth_m": round(baseline_runoff['runoff_depth_mm'] / 1000, 2),
                    "data_source": "SCS_real_calculation"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [center_lon - baseline_buffer, center_lat - baseline_buffer],
                        [center_lon + baseline_buffer, center_lat - baseline_buffer],
                        [center_lon + baseline_buffer, center_lat + baseline_buffer],
                        [center_lon - baseline_buffer, center_lat + baseline_buffer],
                        [center_lon - baseline_buffer, center_lat - baseline_buffer]
                    ]]
                }
            }]
        }
        
        # Create scenario inundation area (expanded based on runoff increase)
        scenario_buffer = baseline_buffer * (1 + runoff_increase / 100)
        scenario_overlay = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {
                    "name": f"{scenario}-inundation",
                    "risk_level": "high" if runoff_increase > 30 else "medium",
                    "depth_m": round(scenario_runoff['runoff_depth_mm'] / 1000, 2),
                    "data_source": "SCS_real_calculation"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [center_lon - scenario_buffer, center_lat - scenario_buffer],
                        [center_lon + scenario_buffer, center_lat - scenario_buffer],
                        [center_lon + scenario_buffer, center_lat + scenario_buffer],
                        [center_lon - scenario_buffer, center_lat + scenario_buffer],
                        [center_lon - scenario_buffer, center_lat - scenario_buffer]
                    ]]
                }
            }]
        }

        result = {
            "status": "success",
            "scenario": scenario,
            "climate_data": climate_data,
            "baseline_runoff": baseline_runoff,
            "scenario_runoff": scenario_runoff,
            "metrics": {
                "baseline_people": int(total_population * 0.05),  # 5% baseline risk
                "scenario_people": people_affected,
                "peak_runoff_change_pct": round(runoff_increase, 1),
                "mean_rain_mm": round(scenario_precipitation, 0),  # Show scenario-specific rainfall
                "total_population": total_population,
                "area_ha": round(area_ha, 2)
            },
            "overlays": {
                "baseline": baseline_overlay,
                "scenarioB": scenario_overlay
            },
            "interventions": recommendations.get('interventions', []),
            "processing_info": {
                "data_source": climate_data['data_source'],
                "processing_time": datetime.now().isoformat(),
                "model": "SCS Curve Number Method",
                "cache_hit": False
            }
        }
        
        # Cache the complete simulation result
        simulation_cache[simulation_cache_key] = result.copy()
        manage_cache()
        logger.info(f"💾 Cached complete simulation for {scenario}")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Simulation error: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """Standalone recommendations endpoint"""
    try:
        data = request.get_json()
        metrics = data.get('metrics', {})
        
        recommendations = llm_service.generate_recommendations(metrics)
        
        return jsonify({
            "status": "success",
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        return jsonify({
            "status": "error", 
            "message": str(e)
        }), 500

@app.route('/api/earth-engine/status', methods=['GET'])
def earth_engine_status():
    """Check Earth Engine connection status"""
    return jsonify({
        "initialized": ee_service.initialized,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 UrbanClimate Digital Twin Backend")
    print("📡 NASA Data: Earth Engine integration")
    print("🤖 AI: LMStudio local LLM")
    print("🌍 Server: http://localhost:5000")
    print("\nEndpoints:")
    print("  GET  /api/health - Health check")
    print("  POST /api/simulate - Climate simulation")
    print("  POST /api/recommend - AI recommendations")
    print("  GET  /api/earth-engine/status - EE status")
    print("  GET  /api/cache/status - Cache status")
    print("  POST /api/cache/clear - Clear cache")
    
    app.run(debug=True, port=5000, host='0.0.0.0')