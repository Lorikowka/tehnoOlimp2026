import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { constructionTypes, getConcreteById, ConcreteClass } from '../data/concreteData';

interface WhatIfModuleProps {
  selectedClass: ConcreteClass | null;
}

type ConstructionState = 'unknown' | 'critical' | 'warning' | 'safe';

const WhatIfModule: React.FC<WhatIfModuleProps> = ({ selectedClass }) => {
  const [selectedConstructionId, setSelectedConstructionId] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(100);

  const selectedConstruction = constructionTypes.find(item => item.id === selectedConstructionId) || null;
  const selectedStrength = selectedClass?.strengthMPa || 0;
  const minRequiredClass = selectedConstruction ? getConcreteById(selectedConstruction.minClass) : null;
  const minRequiredStrength = minRequiredClass?.strengthMPa || 0;

  // Slider gradually weakens the chosen concrete to show where the structure becomes unsafe.
  const currentStrength = selectedStrength * (sliderValue / 100);
  const strengthRatio = minRequiredStrength > 0 ? currentStrength / minRequiredStrength : 0;
  const reservePercent = minRequiredStrength > 0
    ? ((currentStrength - minRequiredStrength) / minRequiredStrength) * 100
    : 0;

  const getConstructionState = (): ConstructionState => {
    if (!selectedClass || !selectedConstruction || minRequiredStrength === 0) return 'unknown';
    if (currentStrength < minRequiredStrength * 0.85) return 'critical';
    if (currentStrength < minRequiredStrength) return 'warning';
    return 'safe';
  };

  const state = getConstructionState();

  const getStateColor = () => {
    switch (state) {
      case 'critical':
        return 'from-red-400 to-red-600';
      case 'warning':
        return 'from-amber-400 to-orange-500';
      case 'safe':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getStateText = () => {
    switch (state) {
      case 'critical':
        return 'Критическое состояние';
      case 'warning':
        return 'Риск трещин и деформаций';
      case 'safe':
        return 'Конструкция в безопасной зоне';
      default:
        return 'Выберите параметры';
    }
  };

  const getStateDescription = () => {
    switch (state) {
      case 'critical':
        return 'Запаса прочности недостаточно. Вероятны серьёзные трещины, потеря несущей способности и разрушение конструкции.';
      case 'warning':
        return 'Бетон уже ниже требуемого уровня. Конструкция ещё может держаться, но работает на пределе и быстро теряет надёжность.';
      case 'safe':
        return selectedClass && selectedConstruction
          ? `${selectedClass.label} сохраняет достаточный запас прочности для конструкции «${selectedConstruction.name}».`
          : '';
      default:
        return 'Выберите тип конструкции и посмотрите, как изменение прочности влияет на результат.';
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/70 rounded-xl p-6 space-y-5 shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-slate-900 dark:to-blue-900 text-white rounded-lg p-4">
        <h2 className="text-xl font-bold mb-1">Что, если выбрать слабый бетон?</h2>
        <p className="text-sm text-blue-100 dark:text-slate-300">
          Модуль показывает, как падает надёжность конструкции, если снижать прочность выбранного класса бетона.
        </p>
      </div>

      {!selectedConstructionId ? (
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Шаг 1: выберите тип конструкции</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {constructionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedConstructionId(type.id)}
                className="p-4 rounded-xl border-2 border-gray-200/50 hover:border-blue-300 dark:border-slate-700/70 dark:hover:border-blue-400 bg-white/60 hover:bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-800/70 transition-all duration-200 text-left backdrop-blur-sm"
              >
                <div className="font-semibold text-slate-700 dark:text-slate-100 text-sm mb-1">{type.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{type.description}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Минимум: {type.minClass.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gray-50/60 dark:bg-slate-900/50 rounded-lg p-4 mb-5 border border-gray-200/50 dark:border-slate-700/70">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{selectedConstruction?.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{selectedConstruction?.description}</p>
              </div>
              <button
                onClick={() => setSelectedConstructionId(null)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
              >
                Изменить
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Минимальный класс: </span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">{selectedConstruction?.minClass.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Требуемая прочность: </span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">{minRequiredStrength} МПа</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/60 dark:bg-slate-900/50 rounded-xl p-5 mb-5 border border-gray-200/50 dark:border-slate-700/70">
            <div className="flex justify-center mb-4">
              <motion.div
                className={`relative w-32 h-32 rounded-lg shadow-lg bg-gradient-to-br ${getStateColor()} overflow-hidden border border-white/20`}
                animate={{
                  scale: state === 'critical' ? [1, 0.96, 1] : state === 'warning' ? [1, 1.01, 1] : 1,
                }}
                transition={{
                  duration: state === 'critical' ? 1 : 2,
                  repeat: state === 'critical' || state === 'warning' ? Infinity : 0,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white/20">
                  {selectedConstruction?.name.charAt(0)}
                </div>

                {(state === 'critical' || state === 'warning') && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <motion.path
                      d={
                        state === 'critical'
                          ? 'M 10 10 L 30 30 L 25 50 L 40 70 L 35 90 M 90 20 L 70 40 L 75 60 L 60 80 M 50 10 L 50 30 L 60 50 L 50 70'
                          : 'M 20 20 L 40 40 L 35 60 M 80 30 L 60 50 L 65 70'
                      }
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth={state === 'critical' ? '3' : '2'}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                )}
              </motion.div>
            </div>

            <div className={`bg-gradient-to-r ${getStateColor()} text-white rounded-lg p-3 text-center`}>
              <div className="font-bold text-base mb-1">{getStateText()}</div>
              <p className="text-xs text-white/90">{getStateDescription()}</p>
            </div>
          </div>

          {selectedClass ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-slate-300 font-medium">Сохранённая прочность бетона:</span>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-400">{sliderValue}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(event) => setSliderValue(Number(event.target.value))}
                className="w-full h-2 bg-gray-200/60 dark:bg-slate-700/60 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #3b82f6 ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`,
                }}
              />

              <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400">
                <span>0% прочности</span>
                <span>{selectedClass.label}</span>
              </div>

              <div className="bg-gray-50/60 dark:bg-slate-900/50 rounded-lg p-4 space-y-2 border border-gray-200/50 dark:border-slate-700/70">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-300">Текущая прочность:</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{currentStrength.toFixed(1)} МПа</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-300">Требуемая прочность:</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{minRequiredStrength} МПа</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-300">Запас прочности:</span>
                  <span className={`font-semibold ${reservePercent >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {reservePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-300">Отношение к минимуму:</span>
                  <span className={`font-semibold ${strengthRatio >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {strengthRatio.toFixed(2)}x
                  </span>
                </div>
              </div>

              <div
                className={`rounded-lg p-4 border-2 ${
                  state === 'critical'
                    ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-700/60'
                    : state === 'warning'
                    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-700/60'
                    : 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-700/60'
                } backdrop-blur-sm`}
              >
                <h4 className="font-bold mb-2 text-sm dark:text-slate-100">Последствия выбора:</h4>
                <ul className="space-y-1.5 text-sm">
                  {state === 'critical' && (
                    <>
                      <li className="text-red-700 dark:text-red-400">Высокий риск разрушения конструкции.</li>
                      <li className="text-red-700 dark:text-red-400">Появляются глубокие трещины и опасные деформации.</li>
                      <li className="text-red-700 dark:text-red-400">Нужна замена или серьёзное усиление решения.</li>
                    </>
                  )}
                  {state === 'warning' && (
                    <>
                      <li className="text-amber-700 dark:text-amber-400">Конструкция работает ниже рекомендуемого уровня.</li>
                      <li className="text-amber-700 dark:text-amber-400">Трещины и снижение ресурса становятся вероятными.</li>
                      <li className="text-amber-700 dark:text-amber-400">Стоит выбрать бетон прочнее или пересчитать нагрузки.</li>
                    </>
                  )}
                  {state === 'safe' && (
                    <>
                      <li className="text-blue-700 dark:text-blue-400">Прочности хватает для выбранного типа конструкции.</li>
                      <li className="text-blue-700 dark:text-blue-400">Запас остаётся в безопасной зоне.</li>
                      <li className="text-blue-700 dark:text-blue-400">Решение ближе к требованиям ТЗ и SRS.</li>
                    </>
                  )}
                  {state === 'unknown' && (
                    <li className="text-slate-600 dark:text-slate-300">Сначала выберите бетон в каталоге, чтобы включить сценарий ослабления.</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/80 border-2 border-amber-200 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-amber-800 text-sm">
                Сначала выберите класс бетона из каталога, чтобы модель могла сравнить его с требованиями конструкции.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default WhatIfModule;
