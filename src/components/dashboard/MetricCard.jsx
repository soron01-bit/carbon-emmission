import { motion } from 'framer-motion';

const MetricCard = ({ title, value, icon: Icon, unit, trend, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-cyan-500/50 transition-colors duration-300"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
      
      <div className="flex justify-between items-center z-10">
        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-zinc-800/80 rounded-lg text-cyan-400 border border-zinc-700/50">
          <Icon size={20} />
        </div>
      </div>
      
      <div className="z-10 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
        {unit && <span className="text-zinc-500 text-sm font-semibold">{unit}</span>}
      </div>
      
      {trend && (
        <div className="z-10 mt-auto pt-2 border-t border-zinc-800/50">
          <span className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.value}
          </span>
          <span className="text-zinc-500 text-xs ml-2">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
