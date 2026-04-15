import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { constructionTypes, loadTypes, concreteClasses, getConcreteById } from '../data/concreteData';

const MixSelector: React.FC = () => {
  const [selectedConstruction, setSelectedConstruction] = useState<string | null>(null);
  const [selectedLoads, setSelectedLoads] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleLoadToggle = (loadId: string) => {
    setSelectedLoads(prev =>
      prev.includes(loadId)
        ? prev.filter(id => id !== loadId)
        : [...prev, loadId]
    );
  };

  const handleCalculate = () => {
    if (!selectedConstruction || selectedLoads.length === 0) return;

    const construction = constructionTypes.find(c => c.id === selectedConstruction);
    if (!construction) return;

    let recommendedClass = construction.recommendedClasses[0];

    if (selectedLoads.includes('seismic') || selectedLoads.includes('dynamic')) {
      const higherIndex = Math.min(construction.recommendedClasses.length - 1, 2);
      recommendedClass = construction.recommendedClasses[higherIndex];
    } else if (selectedLoads.includes('hydrostatic') || selectedLoads.includes('ground-water')) {
      const suitableClasses = construction.recommendedClasses.filter(id => {
        const concrete = getConcreteById(id);
        return concrete && (concrete.watermark.includes('W6') || concrete.watermark.includes('W8') || 
                           concrete.watermark.includes('W10') || concrete.watermark.includes('W12'));
      });
      if (suitableClasses.length > 0) {
        recommendedClass = suitableClasses[0];
      }
    }

    setRecommendation(recommendedClass);
    setStep(3);
  };

  const handleReset = () => {
    setSelectedConstruction(null);
    setSelectedLoads([]);
    setStep(1);
    setRecommendation(null);
  };

  const selectedConstructionData = constructionTypes.find(c => c.id === selectedConstruction);

  return (
    <div className="bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/70 rounded-xl p-6 space-y-5 shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-slate-900 dark:to-blue-900 text-white rounded-lg p-4">
        <h2 className="text-xl font-bold mb-1">Подбор смеси</h2>
        <p className="text-sm text-blue-100 dark:text-slate-300">
          Выберите тип конструкции и нагрузки - мы порекомендуем подходящий класс бетона
        </p>
      </div>

      {/* Шаг 1: Выбор конструкции */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Шаг 1: Выберите тип конструкции</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {constructionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedConstruction(type.id);
                  setStep(2);
                }}
                className="p-4 rounded-xl border-2 border-gray-200/50 hover:border-blue-300 bg-white/60 hover:bg-white/80 dark:border-slate-700/70 dark:bg-slate-900/50 dark:hover:bg-slate-800/70 transition-all duration-200 text-left backdrop-blur-sm"
              >
                <div className="font-semibold text-slate-700 dark:text-slate-100 text-sm mb-1">{type.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{type.description}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Шаг 2: Выбор нагрузок */}
      {step === 2 && selectedConstructionData && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Шаг 2: Выберите типы нагрузок</h3>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
            >
              Назад
            </button>
          </div>

          <div className="bg-gray-50/60 dark:bg-slate-900/50 rounded-lg p-3 mb-4 border border-gray-200/50 dark:border-slate-700/70">
            <div className="font-semibold text-slate-700 dark:text-slate-100">{selectedConstructionData.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Минимальный класс: {selectedConstructionData.minClass.toUpperCase()}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {loadTypes.map(load => (
              <button
                key={load.id}
                onClick={() => handleLoadToggle(load.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left backdrop-blur-sm ${
                  selectedLoads.includes(load.id)
                    ? 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/30'
                    : 'border-gray-200/50 dark:border-slate-700/70 hover:border-blue-300 bg-white/60 dark:bg-slate-900/50'
                }`}
              >
                <div className="font-semibold text-slate-700 dark:text-slate-100 text-sm mb-0.5">{load.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{load.description}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCalculate}
              disabled={selectedLoads.length === 0}
              className={`flex-1 py-3 px-5 rounded-xl font-semibold transition-all ${
                selectedLoads.length === 0
                  ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md dark:from-blue-700 dark:to-blue-800'
              }`}
            >
              Рассчитать рекомендацию
            </button>
            <button
              onClick={handleReset}
              className="py-3 px-5 rounded-xl font-semibold bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/70 text-slate-700 dark:text-slate-100 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all"
            >
              Сброс
            </button>
          </div>
        </motion.div>
      )}

      {/* Шаг 3: Результат */}
      {step === 3 && recommendation && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="bg-blue-50/80 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-700/60 rounded-lg p-5 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-400 mb-1">Рекомендация</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">Подходящий класс бетона найден</p>
            </div>

            {(() => {
              const concrete = getConcreteById(recommendation);
              if (!concrete) return null;
              
              return (
                <div className="bg-white/80 dark:bg-slate-900/50 rounded-lg p-4 space-y-3 border border-gray-100 dark:border-slate-700/70">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{concrete.label}</span>
                    <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg font-semibold text-sm">
                      {concrete.strengthMPa} МПа
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-slate-300 text-sm">{concrete.application}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50/60 dark:bg-slate-800/40 rounded-lg p-2.5 border border-gray-200/50 dark:border-slate-700/50">
                      <div className="text-gray-500 dark:text-slate-400 text-xs">Водонепроницаемость</div>
                      <div className="font-semibold text-gray-700 dark:text-slate-100">{concrete.watermark}</div>
                    </div>
                    <div className="bg-gray-50/60 dark:bg-slate-800/40 rounded-lg p-2.5 border border-gray-200/50 dark:border-slate-700/50">
                      <div className="text-gray-500 dark:text-slate-400 text-xs">Морозостойкость</div>
                      <div className="font-semibold text-gray-700 dark:text-slate-100">{concrete.frostResistance}</div>
                    </div>
                    <div className="bg-gray-50/60 dark:bg-slate-800/40 rounded-lg p-2.5 border border-gray-200/50 dark:border-slate-700/50">
                      <div className="text-gray-500 dark:text-slate-400 text-xs">Огнестойкость</div>
                      <div className="font-semibold text-gray-700 dark:text-slate-100">{concrete.fireResistance}</div>
                    </div>
                    <div className="bg-gray-50/60 dark:bg-slate-800/40 rounded-lg p-2.5 border border-gray-200/50 dark:border-slate-700/50">
                      <div className="text-gray-500 dark:text-slate-400 text-xs">Время застывания</div>
                      <div className="font-semibold text-gray-700 dark:text-slate-100">{concrete.curingTime}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-700/60 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Почему этот бетон подходит:</strong> {concrete.cardInfo}
                    </p>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={handleReset}
              className="mt-4 w-full py-3 px-5 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              Подобрать другую смесь
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MixSelector;
