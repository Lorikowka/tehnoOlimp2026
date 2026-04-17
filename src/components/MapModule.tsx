import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps';
import { motion } from 'framer-motion';
import { mapObjects, concreteClasses, ConcreteClass } from '../data/concreteData';

interface MapModuleProps {
  selectedClass: ConcreteClass | null;
}

const MapModule: React.FC<MapModuleProps> = ({ selectedClass }) => {
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<typeof mapObjects[0] | null>(null);

  const availableClassIds = Array.from(new Set(mapObjects.map(item => item.concreteClass)));
  const filterableClasses = concreteClasses.filter(item => availableClassIds.includes(item.id));

  useEffect(() => {
    setFilterClass(selectedClass?.id || null);
  }, [selectedClass?.id]);

  const filteredObjects = filterClass
    ? mapObjects.filter(item => item.concreteClass === filterClass)
    : mapObjects;

  useEffect(() => {
    if (selectedObject && !filteredObjects.some(item => item.id === selectedObject.id)) {
      setSelectedObject(null);
    }
  }, [filteredObjects, selectedObject]);

  const mapState = {
    center: [59.9343, 30.3351],
    zoom: 10,
  };

  const typeLabels: Record<string, string> = {
    skyscraper: 'Небоскреб',
    bridge: 'Мост',
    tunnel: 'Метро',
    'floor-slab': 'Стадион',
    dam: 'Дамба',
    foundation: 'Фундамент',
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/85 backdrop-blur-xl border border-white/40 dark:border-slate-700/70 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-slate-900 dark:to-blue-900 text-white">
        <h2 className="text-xl font-bold mb-1">Карта применения бетона в Санкт-Петербурге</h2>
        <p className="text-sm text-blue-100">
          Объекты на карте синхронизируются с выбранным классом бетона и помогают быстро увидеть реальные примеры применения.
        </p>
      </div>

      <div className="p-4 bg-gray-50/60 border-b border-gray-200/50 dark:bg-slate-950/60 dark:border-slate-700/60">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterClass(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !filterClass
                ? 'bg-blue-500 text-white'
                : 'bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50'
            }`}
          >
            Все объекты
          </button>
          {filterableClasses.map(item => (
            <button
              key={item.id}
              onClick={() => setFilterClass(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterClass === item.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {selectedClass && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Активный класс из каталога: <span className="font-semibold text-blue-700 dark:text-blue-400">{selectedClass.label}</span>
          </p>
        )}
      </div>

      <YMaps>
        <div className="w-full h-[500px]">
          <Map defaultState={mapState} width="100%" height="100%">
            <Clusterer
              options={{
                preset: 'islands#invertedBlueClusterIcons',
                clusterDisableClickZoom: true,
              }}
            >
              {filteredObjects.map(item => (
                <Placemark
                  key={item.id}
                  geometry={item.coordinates}
                  properties={{
                    balloonContentHeader: item.name,
                    balloonContentBody: `
                      <div style="padding: 8px; font-family: sans-serif; color: #1f2937;">
                        <p style="font-weight: bold; margin-bottom: 4px;">Класс бетона: ${item.concreteClass.toUpperCase()}</p>
                        <p style="font-size: 13px; margin: 0 0 4px 0;">${item.description}</p>
                        <p style="font-size: 11px; color: #4b5563; margin-top: 8px;">Тип: ${typeLabels[item.type] || item.type}</p>
                        <p style="font-size: 11px; color: #6b7280; margin-top: 4px;">Локация: Санкт-Петербург</p>
                      </div>
                    `,
                    hintContent: `${item.name} — ${item.concreteClass.toUpperCase()}`,
                    iconContent: item.concreteClass.toUpperCase(),
                  }}
                  options={{
                    preset: 'islands#blueStretchyIcon',
                    iconColor: '#1d4ed8',
                    balloonPanelMaxMapArea: 0,
                  }}
                  onClick={() => setSelectedObject(item)}
                />
              ))}
            </Clusterer>
          </Map>
        </div>
      </YMaps>

      {selectedObject && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-50/60 dark:bg-slate-950/80 border-t border-gray-200/50 dark:border-slate-700/60"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-2">{selectedObject.name}</h3>
          <p className="text-gray-600 dark:text-slate-300 text-sm mb-3">{selectedObject.description}</p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-semibold">
              Бетон: {selectedObject.concreteClass.toUpperCase()}
            </span>
            <span className="bg-gray-100 dark:bg-slate-800/70 text-gray-700 dark:text-slate-200 px-3 py-1 rounded-lg text-sm font-semibold border border-gray-200/50 dark:border-slate-700/50">
              Тип: {typeLabels[selectedObject.type] || selectedObject.type}
            </span>
          </div>
        </motion.div>
      )}

      <div className="p-4 bg-gray-50/60 dark:bg-slate-950/80 border-t border-gray-200/50 dark:border-slate-700/60">
        <h4 className="font-semibold text-gray-700 dark:text-slate-100 mb-2 text-sm">Легенда карты</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {Object.entries(typeLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapModule;
