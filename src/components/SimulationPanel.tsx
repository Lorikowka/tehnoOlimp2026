import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConcreteClass, concretePhysics } from '../data/concreteData';
import Visualizer from './Visualizer';
import ThreePinataScene from './ThreePinataScene';

interface SimulationPanelProps {
  selectedClass: ConcreteClass | null;
}

type TestStatus = 'idle' | 'loading' | 'destroyed';

const SimulationPanel: React.FC<SimulationPanelProps> = ({ selectedClass }) => {
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [currentLoadMPa, setCurrentLoadMPa] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);

  const physics = selectedClass ? concretePhysics[selectedClass.id] : undefined;
  const maxLoad = selectedClass?.strengthMPa || 0;

  const handleStartTest = () => {
    if (!selectedClass || testStatus === 'loading') return;

    setTestStatus('loading');
    setShowComparison(false);
    setCurrentLoadMPa(0);
    setLoadProgress(0);

    const duration = 3500;
    const interval = 50;
    const steps = duration / interval;
    const increment = maxLoad / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const newLoad = increment * step;
      setCurrentLoadMPa(newLoad);
      setLoadProgress((newLoad / maxLoad) * 100);

      if (step >= steps) {
        clearInterval(timer);
        setTestStatus('destroyed');
        setShowComparison(true);
      }
    }, interval);
  };

  const handleReset = () => {
    setTestStatus('idle');
    setCurrentLoadMPa(0);
    setLoadProgress(0);
    setShowComparison(false);
    setSceneKey(prev => prev + 1);
  };

  if (!selectedClass) {
    return (
      <div className="bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/70 rounded-xl p-8 h-full">
        <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
          <div className="text-center">
            <p className="text-lg">Выберите класс бетона из каталога</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/70 rounded-xl p-6 space-y-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Виртуальное испытание</h2>
        <span className="bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-slate-100 px-3 py-1 rounded-lg text-sm font-semibold">
          {selectedClass.label}
        </span>
      </div>

      <ThreePinataScene
        key={`three-pinata-${selectedClass.label}-${sceneKey}`}
        selectedClass={selectedClass}
        testStatus={testStatus}
        currentLoadMPa={currentLoadMPa}
        maxLoadMPa={maxLoad}
      />

      {/* Визуализатор */}
      <Visualizer
        loadProgress={loadProgress}
        testStatus={testStatus}
        currentLoadMPa={currentLoadMPa}
        maxLoadMPa={maxLoad}
      />

      {/* Информация о бетоне */}
      <div className="bg-gray-50/60 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200/50 dark:border-slate-700/70">
        <h3 className="font-semibold text-gray-700 dark:text-slate-100 mb-2 text-sm">Сфера применения</h3>
        <p className="text-gray-600 dark:text-slate-300 text-sm">{selectedClass.application}</p>
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-3">
        <button
          onClick={handleStartTest}
          disabled={testStatus === 'loading'}
          className={`flex-1 py-3 px-5 rounded-xl font-semibold transition-all duration-200 ${
            testStatus === 'loading'
              ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {testStatus === 'loading' ? 'Испытание...' : 'Протестировать прочность'}
        </button>
        <button
          onClick={handleReset}
          className="py-3 px-5 rounded-xl font-semibold bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/70 text-gray-700 dark:text-slate-200 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all duration-200"
        >
          Сброс
        </button>
      </div>


      {/* Результат испытания */}
      {testStatus === 'destroyed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50/80 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-700/60 rounded-lg p-4 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-1">Разрушение!</h3>
          <p className="text-red-700 dark:text-red-400 text-sm">
            Прочность <strong>{selectedClass.label}</strong> составляет <strong>{selectedClass.strengthMPa} МПа</strong>
          </p>
        </motion.div>
      )}

      {/* Модуль сравнения */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Сравнение с повседневными объектами</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {selectedClass.comparisonData.map(item => (
              <div key={item.id} className="bg-gray-50/60 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200/50 dark:border-slate-700/70">
                <div className="mb-2">
                  <div className="font-semibold text-gray-700 dark:text-slate-100">{item.name}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">{item.description}</div>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg p-3 mt-2 border border-gray-100 dark:border-slate-700/70">
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                    {item.value.toFixed(1)} {item.unit}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Формула: {item.calculation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SimulationPanel;
