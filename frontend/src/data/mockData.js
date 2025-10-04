export const samplePlan = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"name":"pilot-trichy-ward"},
      "geometry": {
        "type": "Polygon",
        "coordinates":[[[80.27,13.07],[80.28,13.07],[80.28,13.08],[80.27,13.08],[80.27,13.07]]]
      }
    }
  ]
};

export const baselineOverlay = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "baseline-inundation",
        "risk_level": "medium"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[80.271, 13.071], [80.275, 13.071], [80.275, 13.075], [80.271, 13.075], [80.271, 13.071]]]
      }
    }
  ]
};

export const scenarioBOverlay = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "scenario-b-inundation",
        "risk_level": "high"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[80.270, 13.070], [80.277, 13.070], [80.277, 13.077], [80.270, 13.077], [80.270, 13.070]]]
      }
    }
  ]
};

export const mockSimulationData = {
  metrics: {
    baseline_people: 700,
    scenarioB_people: 2100,
    peak_runoff_change_pct: 45,
    mean_rain_mm: 1250
  },
  interventions: [
    {
      title: "Retention Basin",
      description: "Construct detention basin to capture and slowly release stormwater runoff.",
      runoff_reduction_pct: 25,
      cost_bracket: "Medium (₹50-80 lakhs)",
      implementation_months: 12,
      kpi: "Peak flow reduction measurement",
      contact: "Municipal Engineering Department"
    },
    {
      title: "Green Roofs",
      description: "Install vegetation on building rooftops to absorb rainfall and reduce runoff.",
      runoff_reduction_pct: 15,
      cost_bracket: "Low (₹20-35 lakhs)",
      implementation_months: 6,
      kpi: "Roof coverage area percentage",
      contact: "Urban Development Authority"
    },
    {
      title: "Permeable Paving",
      description: "Replace impervious surfaces with permeable materials to increase infiltration.",
      runoff_reduction_pct: 20,
      cost_bracket: "Low (₹25-40 lakhs)",
      implementation_months: 8,
      kpi: "Infiltration rate measurements",
      contact: "Public Works Department"
    }
  ]
};