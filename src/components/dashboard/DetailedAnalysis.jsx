import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DetailedAnalysis = ({ metrics }) => {
  const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 25, 0.9)',
        titleColor: '#00f3ff',
        borderColor: 'rgba(0, 243, 255, 0.2)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#71717a' }
      }
    }
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Carbon Intensity',
        data: [
          metrics.carbonEmission * 0.8,
          metrics.carbonEmission * 0.6,
          metrics.carbonEmission * 0.9,
          metrics.carbonEmission,
          metrics.carbonEmission * 1.1,
          metrics.carbonEmission * 0.95,
          metrics.carbonEmission * 0.85
        ],
        borderColor: '#00f3ff',
        backgroundColor: 'rgba(0, 243, 255, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel p-6 mt-10"
      id="detailed-analysis"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Temporal Data Analysis</h2>
          <p className="text-sm text-zinc-500">24-hour environmental trend forecasting for current node.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Peak Carbon</p>
            <p className="text-cyan-400 font-bold">{(metrics.carbonEmission * 1.1).toFixed(0)} t/h</p>
          </div>
          <div className="w-px h-8 bg-zinc-800"></div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Forecasted AQI</p>
            <p className="text-purple-400 font-bold">{metrics.aqi}</p>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <Line options={options} data={data} />
      </div>
    </motion.div>
  );
};

export default DetailedAnalysis;
