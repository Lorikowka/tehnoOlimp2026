import React, { useState, useEffect } from 'react';
import { ConcreteClass } from '../data/concreteData';

interface ConcreteCardProps {
  concrete: ConcreteClass;
  onClick: () => void;
  isSelected: boolean;
}

const ConcreteCard: React.FC<ConcreteCardProps> = ({ concrete, onClick, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const strengthPercent = (concrete.strengthMPa / 120) * 100;

  useEffect(() => {
    if (!isSelected) {
      setIsExpanded(false);
    }
  }, [isSelected]);

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl cursor-pointer transition-all duration-300 overflow-visible border-2 group ${
        isSelected
          ? 'border-blue-500 shadow-lg bg-white/90 dark:bg-slate-900/80 z-50'
          : 'border-white/30 hover:border-blue-300 hover:shadow-lg bg-white/70 dark:bg-slate-950/70 z-auto'
      } backdrop-blur-xl dark:border-slate-700/70 text-slate-900 dark:text-slate-100`}
    >
      {/* Цветная полоса сверху */}
      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-t-xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
          style={{ width: `${strengthPercent}%` }}
        />
      </div>

      <div className="p-5">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{concrete.label}</h3>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold dark:bg-slate-800 dark:text-slate-100">
            {concrete.strengthMPa} МПа
          </span>
        </div>

        {/* Описание */}
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{concrete.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (!isSelected) {
                onClick();
              }
              setIsExpanded(prev => !prev);
            }}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-colors duration-200 ${
              isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>{isSelected ? (isExpanded ? '▲' : '') : ''}</span>
            <span>
              {isSelected ? (isExpanded ? 'Свернуть' : 'Детали') : 'Выбрать'}
            </span>
          </button>
          {isSelected && (
            <span className="text-xs text-blue-600 dark:text-slate-200 font-medium">Выбран</span>
          )}
        </div>
      </div>

      {isSelected && isExpanded && (
        <div className="absolute left-0 right-0 top-full mt-4 z-[9999] bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border border-gray-200/70 dark:border-slate-700/70 shadow-2xl rounded-3xl p-4 space-y-4 min-w-[320px] max-h-[420px] overflow-y-auto">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-3 border border-gray-200/70 dark:border-slate-700/70">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5">Водонепроницаемость</div>
              <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{concrete.watermark}</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-3 border border-gray-200/70 dark:border-slate-700/70">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5">Морозостойкость</div>
              <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{concrete.frostResistance}</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-3 border border-gray-200/70 dark:border-slate-700/70">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5">Огнестойкость</div>
              <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{concrete.fireResistance}</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-3 border border-gray-200/70 dark:border-slate-700/70">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5">Застывание</div>
              <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{concrete.curingTime}</div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 mb-1.5">Описание</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{concrete.detailedInfo}</p>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 mb-1.5">Состав</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{concrete.composition}</p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 mb-1.5">Применение</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{concrete.application}</p>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 mb-1.5">Рекомендуется</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{concrete.recommendedUse}</p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 mb-1.5">Условия застывания</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{concrete.standardCuringConditions}</p>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 mb-1.5">Набор прочности</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{concrete.strengthGainTime}</p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-slate-950 rounded-2xl p-3 border border-red-200/70 dark:border-red-700/40">
            <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-red-700 dark:text-red-300 mb-1.5">Ограничения</div>
            <p className="text-sm text-red-800 dark:text-red-200 leading-tight">{concrete.limitations}</p>
          </div>
        </div>
      )}

      {/* Маркер выделения */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ConcreteCard;
