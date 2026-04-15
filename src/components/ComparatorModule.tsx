import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { concreteClasses, getConcreteById, everydayForces, ConcreteClass } from '../data/concreteData';

interface ComparatorModuleProps {
  selectedClass: ConcreteClass | null;
}

const ComparatorModule: React.FC<ComparatorModuleProps> = ({ selectedClass }) => {
  const [forceObjects, setForceObjects] = useState<string[]>([]);
  const [totalForce, setTotalForce] = useState(0);

  const handleToggleForce = (forceId: string) => {
    setForceObjects(prev => {
      const exists = prev.includes(forceId);
      const force = everydayForces.find(f => f.id === forceId);
      if (!force) return prev;

      const newTotal = exists
        ? totalForce - force.force
        : totalForce + force.force;

      setTotalForce(newTotal);

      return exists
        ? prev.filter(id => id !== forceId)
        : [...prev, forceId];
    });
  };

  const handleReset = () => {
    setForceObjects([]);
    setTotalForce(0);
  };

  // Расчет давления в МПа (площадь 10x10 см = 0.01 м2)
  const area = 0.01;
  const totalForceN = totalForce * 9.8;
  const pressurePa = totalForceN / area;
  const pressureMPa = pressurePa / 1e6;

  const selectedStrength = selectedClass?.strengthMPa || 0;
  const percentOfSelected = selectedStrength > 0 ? (pressureMPa / selectedStrength) * 100 : 0;

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'transport': return 'Транспорт';
      case 'animals': return 'Животные';
      case 'nature': return 'Природные силы';
      case 'people': return 'Люди';
      case 'objects': return 'Предметы';
      case 'military': return 'Техника';
      default: return cat;
    }
  };

  const categories = ['transport', 'animals', 'nature', 'people', 'objects', 'military'];

  return (
    <div className="bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/70 rounded-xl p-6 space-y-5 shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-slate-900 dark:to-blue-900 text-white rounded-lg p-4">
        <h2 className="text-xl font-bold mb-1">Компаратор</h2>
        <p className="text-sm text-blue-100 dark:text-slate-300">
          Соберите эквивалентное давление из повседневных объектов и сравните с прочностью бетона
        </p>
      </div>

      {selectedClass ? (
        <div className="bg-gray-50/60 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200/50 dark:border-slate-700/70">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-100 text-sm">Выбранный бетон:</h3>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedClass.label}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 dark:text-slate-400">Прочность</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedClass.strengthMPa} МПа</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/80 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700/60 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-amber-800 dark:text-amber-300 text-sm">
            Сначала выберите класс бетона из каталога для сравнения
          </p>
        </div>
      )}

      {/* Выбранные объекты */}
      {forceObjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/50 backdrop-blur-sm"
        >
          <h3 className="font-bold text-blue-800 mb-3 text-sm">Собранные объекты</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {forceObjects.map(id => {
              const force = everydayForces.find(f => f.id === id);
              if (!force) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleToggleForce(id)}
                  className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/50 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all border border-gray-200/50 dark:border-slate-600/50"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-slate-100">{force.name}</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{(force.force / 1000).toFixed(1)} т</span>
                  <span className="text-red-500 ml-1 text-sm">×</span>
                </button>
              );
            })}
          </div>

          {/* Итоговая нагрузка */}
          <div className="bg-white/80 dark:bg-slate-900/50 rounded-lg p-4 space-y-3 border border-gray-100 dark:border-slate-700/70">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-slate-300">Общий вес:</span>
              <span className="text-xl font-bold text-gray-800 dark:text-slate-100">
                {(totalForce / 1000).toFixed(2)} тонн
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-slate-300">Давление на 10x10 см:</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {pressureMPa.toFixed(2)} МПа
              </span>
            </div>

            {/* Прогресс-бар */}
            {selectedStrength > 0 && selectedClass && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-slate-300">Относительно {selectedClass.label}:</span>
                  <span className="font-semibold text-gray-700 dark:text-slate-200">{percentOfSelected.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full transition-all duration-300 rounded-full ${
                      percentOfSelected >= 100
                        ? 'bg-gradient-to-r from-red-400 to-red-600'
                        : percentOfSelected >= 60
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-to-r from-blue-400 to-blue-600'
                    }`}
                    style={{ width: `${Math.min(percentOfSelected, 100)}%` }}
                  />
                </div>
                {percentOfSelected >= 100 && selectedClass && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-semibold">
                    Превышена прочность бетона {selectedClass.label}!
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Доступные объекты */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100 mb-3">Доступные объекты</h3>
        
        {categories.map(cat => {
          const forces = everydayForces.filter(f => f.category === cat);
          if (forces.length === 0) return null;
          
          return (
            <div key={cat} className="mb-5">
              <h4 className="font-semibold text-gray-600 dark:text-slate-300 mb-2 text-sm">{getCategoryTitle(cat)}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {forces.map(force => (
                  <button
                    key={force.id}
                    onClick={() => handleToggleForce(force.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      forceObjects.includes(force.id)
                        ? 'border-blue-400 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/40'
                        : 'border-gray-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-400 bg-white/60 dark:bg-slate-800/30'
                    } backdrop-blur-sm`}
                  >
                    <div className="font-semibold text-gray-700 dark:text-slate-100 text-sm mb-0.5">{force.name}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{force.description}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопка сброса */}
      {forceObjects.length > 0 && (
        <button
          onClick={handleReset}
          className="w-full py-3 px-5 rounded-xl font-semibold bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/70 text-gray-700 dark:text-slate-200 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all duration-200"
        >
          Сбросить все объекты
        </button>
      )}
    </div>
  );
};

export default ComparatorModule;
