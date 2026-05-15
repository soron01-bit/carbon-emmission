import { useState, useEffect } from 'react';
import { CloudRain, Wind, Activity, Factory, Car, Navigation, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MetricCard from './components/dashboard/MetricCard';
import CityMap from './components/dashboard/CityMap';
import DetailedAnalysis from './components/dashboard/DetailedAnalysis';
import { mockDashboardData, generateLocationData } from './services/mockData';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(mockDashboardData.summary);
  const [nodeStatus, setNodeStatus] = useState("NYC-Alpha-01");
  const [cityName, setCityName] = useState("New York");
  const [isUpdating, setIsUpdating] = useState(false);
  const [mapData, setMapData] = useState(mockDashboardData.mapData);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Simulate initial data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationChange = async (lat, lon) => {
    setIsUpdating(true);

    // Reverse Geocoding to get City Name
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Local Area";
      setCityName(city);
    } catch (error) {
      console.error("Geocoding error:", error);
      setCityName("Local Area");
    }

    // Simulate a brief delay for "scanning" new location data
    setTimeout(() => {
      const newData = generateLocationData(lat, lon);
      setMetrics({
        aqi: newData.aqi,
        temperature: newData.temperature,
        carbonEmission: newData.carbonEmission,
        trafficCongestion: newData.trafficCongestion
      });
      setNodeStatus(newData.status);
      setMapData({
        center: [lat, lon],
        zones: newData.zones
      });
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900 via-zinc-950 to-zinc-950"></div>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900 via-transparent to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              exit={{ opacity: 0 }}
              className="h-[80vh] flex flex-col items-center justify-center gap-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-spin animation-delay-150"></div>
              </div>
              <p className="text-cyan-500 animate-pulse text-sm font-mono tracking-widest uppercase">Initializing City Core...</p>
            </motion.div>
          ) : !showAnalysis ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                    <Activity className="text-cyan-400" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                      Urban Pulse
                    </h1>
                    <p className="text-zinc-500 text-sm tracking-wide">SMART CITY DIGITAL TWIN</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/60 rounded-full border border-zinc-800 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-zinc-300">
                      {isUpdating ? 'Scanning...' : 'Live Sync'}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-zinc-700"></div>
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-tighter">NODE: {nodeStatus}</span>
                </div>
              </header>

              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                  <div className="lg:col-span-1 flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={nodeStatus}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.5 }}
                        className="flex flex-col gap-4"
                      >
                        <MetricCard
                          title="Air Quality (AQI)"
                          value={metrics.aqi}
                          unit={`${cityName} AQI`}
                          icon={Wind}
                          trend={{ value: '+12%', label: 'local variance', isPositive: false }}
                          delay={0.1}
                        />
                        <MetricCard title="Carbon Emission" value={metrics.carbonEmission} unit="t/day" icon={Factory} trend={{ value: '-5%', label: 'sector avg', isPositive: true }} delay={0.2} />
                        <MetricCard title="Traffic Congestion" value={`${metrics.trafficCongestion}%`} icon={Car} trend={{ value: '+2%', label: 'local density', isPositive: false }} delay={0.3} />
                        <MetricCard title="Avg Temperature" value={`${metrics.temperature}°C`} icon={CloudRain} trend={{ value: '+1.2°C', label: 'micro-climate', isPositive: false }} delay={0.4} />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="lg:col-span-3 flex flex-col gap-6">
                    <CityMap mapData={mapData} onLocationChange={handleLocationChange} />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">System Status</h3>
                        <p className="text-sm text-zinc-500">
                          {isUpdating ? `Recalibrating...` : `Sensors at Node ${nodeStatus} are operational.`}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAnalysis(true)}
                        className="w-full sm:w-auto px-6 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <Navigation size={16} />
                        Detailed Analysis
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              <button
                onClick={() => setShowAnalysis(false)}
                className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors group"
              >
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 group-hover:border-cyan-500/50">
                  <ChevronLeft size={20} />
                </div>
                <span className="font-medium">Back to Dashboard</span>
              </button>

              <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Detailed Analysis Report</h1>
                <div className="flex items-center gap-2 text-zinc-500">
                  <Activity size={16} className="text-cyan-500" />
                  <span className="text-sm font-mono uppercase tracking-widest">Active Link: {nodeStatus} ({cityName})</span>
                </div>
              </header>

              <DetailedAnalysis metrics={metrics} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="glass-panel p-6">
                  <h3 className="text-white font-semibold mb-3">Environmental Summary</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Based on current sensor data from node {nodeStatus} in {cityName}, the area is experiencing {metrics.aqi > 100 ? 'elevated' : 'moderate'} pollutant levels.
                    Recommended action: {metrics.aqi > 100 ? 'Deploy air filtration drones.' : 'Continue routine monitoring.'}
                  </p>
                </div>
                <div className="glass-panel p-6">
                  <h3 className="text-white font-semibold mb-3">System Insights</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Traffic congestion is currently at {metrics.trafficCongestion}%. Automated rerouting is {metrics.trafficCongestion > 50 ? 'active' : 'on standby'}.
                    Thermal index indicates a {metrics.temperature > 30 ? 'high' : 'stable'} heat island signature.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-20 py-10 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">Urban Pulse © 2026 • Intelligent City Systems</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
