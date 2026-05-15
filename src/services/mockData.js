export const mockDashboardData = {
  summary: {
    aqi: 142,
    aqiStatus: 'Unhealthy',
    temperature: 31,
    carbonEmission: 420, // tons/day
    trafficCongestion: 78 // percentage
  },
  mapData: {
    center: [40.7128, -74.0060], // New York example
    zones: [
      { id: 1, position: [40.7128, -74.0060], type: 'pollution', value: 'High AQI (150)', radius: 500, color: '#ef4444' },
      { id: 2, position: [40.7200, -74.0100], type: 'traffic', value: 'Heavy Congestion', radius: 300, color: '#f59e0b' },
      { id: 3, position: [40.7050, -73.9900], type: 'heat', value: 'Heat Island (+4°C)', radius: 600, color: '#bc13fe' },
      { id: 4, position: [40.7300, -73.9950], type: 'safe', value: 'Good Air Quality', radius: 400, color: '#10b981' }
    ]
  }
};

export const generateLocationData = (lat, lon) => {
  // Use coordinates to create some deterministic but "different" data
  const seed = (lat + lon) * 1000;
  const random = (s) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  return {
    aqi: Math.floor(random(seed) * 150 + 50),
    temperature: Math.floor(random(seed + 1) * 15 + 20),
    carbonEmission: Math.floor(random(seed + 2) * 500 + 200),
    trafficCongestion: Math.floor(random(seed + 3) * 60 + 20),
    status: `Node: ${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    // Generate 3-4 random zones near the user
    zones: [
      {
        id: `p-${seed}`,
        position: [lat + (random(seed + 4) - 0.5) * 0.02, lon + (random(seed + 5) - 0.5) * 0.02],
        type: 'pollution', value: 'Local AQI Spike', radius: 400, color: '#ef4444'
      },
      {
        id: `t-${seed}`,
        position: [lat + (random(seed + 6) - 0.5) * 0.02, lon + (random(seed + 7) - 0.5) * 0.02],
        type: 'traffic', value: 'Congestion Alert', radius: 300, color: '#f59e0b'
      },
      {
        id: `h-${seed}`,
        position: [lat + (random(seed + 8) - 0.5) * 0.02, lon + (random(seed + 9) - 0.5) * 0.02],
        type: 'heat', value: 'Thermal Anomaly', radius: 500, color: '#bc13fe'
      }
    ]
  };
};
