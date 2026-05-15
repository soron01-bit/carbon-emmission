import { useState, useEffect } from 'react';
import { CloudRain, Wind, Activity, Factory, Car, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MetricCard from './components/dashboard/MetricCard';
import CityMap from './components/dashboard/CityMap';
import { mockDashboardData, generateLocationData } from './services/mockData';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(mockDashboardData.summary);
  const [nodeStatus, setNodeStatus] = useState("NYC-Alpha-01");
  const [isUpdating, setIsUpdating] = useState(false);
  const [mapData, setMapData] = useState(mockDashboardData.mapData);

  // Simulate initial data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationChange = (lat, lon) => {
    setIsUpdating(true);
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/30">
      {/* Background ambient effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900 via-zinc-950 to-zinc-950"></div>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900 via-transparent to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <Activity className="text-cyan-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Urban Pulse
              </h1>
              <p className="text-zinc-500 text-sm tracking-wide">SMART CITY DIGITAL TWIN</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-4 py-2 bg-zinc-900/60 rounded-full border border-zinc-800 backdrop-blur-md"
          >
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
            <span className="text-xs text-zinc-500 font-mono">NODE: {nodeStatus}</span>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-spin animation-delay-150"></div>
            </div>
            <p className="text-cyan-500 animate-pulse text-sm font-mono tracking-widest">INITIALIZING SENSORS...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column: Metrics */}
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
                    unit="US AQI"
                    icon={Wind}
                    trend={{ value: '+12%', label: 'local variance', isPositive: false }}
                    delay={0.1}
                  />
                  <MetricCard 
                    title="Carbon Emission" 
                    value={metrics.carbonEmission} 
                    unit="t/day"
                    icon={Factory}
                    trend={{ value: '-5%', label: 'sector avg', isPositive: true }}
                    delay={0.2}
                  />
                  <MetricCard 
                    title="Traffic Congestion" 
                    value={`${metrics.trafficCongestion}%`} 
                    icon={Car}
                    trend={{ value: '+2%', label: 'local density', isPositive: false }}
                    delay={0.3}
                  />
                  <MetricCard 
                    title="Avg Temperature" 
                    value={`${metrics.temperature}°C`} 
                    icon={CloudRain}
                    trend={{ value: '+1.2°C', label: 'micro-climate', isPositive: false }}
                    delay={0.4}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Map & Main View */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <CityMap 
                mapData={mapData} 
                onLocationChange={handleLocationChange}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass-panel p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">System Status</h3>
                  <p className="text-sm text-zinc-500">
                    {isUpdating 
                      ? `Recalibrating for coordinates ${nodeStatus}...` 
                      : `All sensors at ${nodeStatus} are operational.`}
                  </p>
                </div>
                <button className="px-6 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-2">
                  <Navigation size={16} />
                  Detailed Analysis
                </button>
              </motion.div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
