import React from 'react';
import { motion } from 'framer-motion';

interface VisualizerProps {
  loadProgress: number;
  testStatus: 'idle' | 'loading' | 'destroyed';
  currentLoadMPa: number;
  maxLoadMPa: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ loadProgress, testStatus, currentLoadMPa, maxLoadMPa }) => {
  const getStatusColor = () => {
    if (testStatus === 'destroyed') return 'from-red-400 to-red-600';
    if (loadProgress > 60) return 'from-amber-400 to-orange-500';
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950/80 dark:to-slate-900/60 rounded-xl p-6 border border-gray-200/50 dark:border-slate-700/70">
      

      <div className="bg-white/90 dark:bg-slate-900/70 rounded-3xl p-5 border border-gray-200/60 dark:border-slate-700/70">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Текущая нагрузка</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{currentLoadMPa.toFixed(1)} МПа</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 dark:text-slate-400">Максимум</div>
            <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">{maxLoadMPa} МПа</div>
          </div>
        </div>

        <div className="h-3 rounded-full bg-gray-200/70 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getStatusColor()}`}
            initial={false}
            animate={{ width: `${loadProgress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          {testStatus === 'destroyed'
            ? 'Блок разрушен. Проверьте результаты испытания.'
            : testStatus === 'loading'
            ? 'Нагрузка нарастает, блок удерживает давление...'
            : 'Нажмите «Протестировать прочность», чтобы начать испытание.'}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
