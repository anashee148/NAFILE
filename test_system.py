#!/usr/bin/env python3
"""
Quick test script for UrbanClimate Digital Twin API
Tests backend endpoints and data processing
"""

import requests
import json
import time

def test_health():
    """Test backend health endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend Health Check: OK")
            ee_status = data['services']['earth_engine']['status']
            print(f"   Earth Engine: {'✅' if ee_status == 'connected' else '⚠️ Auth Required'}")
            return True
        else:
            print(f"❌ Backend Health Check Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend Connection Failed: {e}")
        return False

def test_simulation():
    """Test climate simulation endpoint"""
    try:
        payload = {
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[80.27,13.07],[80.28,13.07],[80.28,13.08],[80.27,13.08],[80.27,13.07]]]
            },
            "scenario": "baseline"
        }
        
        print("🔄 Testing Climate Simulation...")
        response = requests.post(
            'http://localhost:5000/api/simulate', 
            json=payload, 
            timeout=300  # 5 minutes for real NASA data processing
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Climate Simulation: SUCCESS")
            print(f"   Data Source: {data['processing_info']['data_source']}")
            print(f"   People Affected: {data['metrics']['scenario_people']}")
            print(f"   Peak Runoff Change: +{data['metrics']['peak_runoff_change_pct']}%")
            print(f"   Interventions: {len(data['interventions'])} recommendations")
            return True
        else:
            print(f"❌ Climate Simulation Failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Simulation Request Failed: {e}")
        return False

def test_lmstudio():
    """Test LMStudio connection"""
    try:
        payload = {
            "metrics": {
                "peak_runoff_change_pct": 45,
                "people_affected": 2100,
                "area_ha": 100
            }
        }
        
        print("🤖 Testing LMStudio AI Recommendations...")
        response = requests.post(
            'http://localhost:5000/api/recommend',
            json=payload
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ LMStudio AI: SUCCESS")
            print(f"   Recommendations: {len(data['recommendations']['interventions'])} interventions")
            return True
        else:
            print(f"⚠️ LMStudio AI: Using Fallback (LMStudio offline)")
            return False
            
    except Exception as e:
        print(f"⚠️ LMStudio Connection: {e}")
        return False

def main():
    print("🧪 UrbanClimate Digital Twin - System Test")
    print("=" * 50)
    
    # Test sequence
    health_ok = test_health()
    time.sleep(1)
    
    if health_ok:
        simulation_ok = test_simulation()
        time.sleep(1)
        test_lmstudio()
    
    print("\n" + "=" * 50)
    print("🎯 System Test Complete!")
    print("\n📋 Next Steps:")
    print("   1. Open http://localhost:5174 in browser")
    print("   2. Click 'Load Sample Data' to test frontend")
    print("   3. Click 'Run Simulation' to test full pipeline")
    print("   4. Upload CoLab notebook for real NASA data")
    print("   5. Start LMStudio for AI recommendations")
    
if __name__ == "__main__":
    main()