import React, { useState } from 'react';
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps';
import { motion } from 'framer-motion';
import { mapObjects, concreteClasses, ConcreteClass } from '../data/concreteData';

interface MapModuleProps {
  selectedClass: ConcreteClass | null;
}

const MapModule: React.FC<MapModuleProps> = ({ selectedClass }) => {
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<typeof mapObjects[0] | null>(null);

  const filteredObjects = filterClass && filterClass !== 'all'
    ? mapObjects.filter(obj => obj.concreteClass === filterClass)
    : mapObjects;

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
          Реальные объекты, построенные с использованием различных классов бетона
        </p>
      </div>

      {/* Фильтр */}
      <div className="p-4 bg-gray-50/60 border-b border-gray-200/50">
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
          {concreteClasses.slice(5, 13).map(c => (
            <button
              key={c.id}
              onClick={() => setFilterClass(c.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterClass === c.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Карта */}
      <YMaps>
        <div className="w-full h-[500px]">
          <Map
            defaultState={mapState}
            width="100%"
            height="100%"
          >
            <Clusterer
              options={{
                preset: 'islands#invertedBlueClusterIcons',
                clusterDisableClickZoom: true,
              }}
            >
              {filteredObjects.map(obj => (
                <Placemark
                  key={obj.id}
                  geometry={obj.coordinates}
                  properties={{
                    balloonContentHeader: obj.name,
                    balloonContentBody: `
                      <div style="padding: 8px; font-family: Inter, sans-serif; color: #1f2937;">
                        <p style="font-weight: bold; margin-bottom: 4px;">Класс бетона: ${obj.concreteClass.toUpperCase()}</p>
                        <p style="font-size: 13px; margin: 0 0 4px 0;">${obj.description}</p>
                        <p style="font-size: 11px; color: #4b5563; margin-top: 8px;">Тип: ${typeLabels[obj.type] || obj.type}</p>
                        <p style="font-size: 11px; color: #6b7280; margin-top: 4px;">Минск 📍 Санкт-Петербург</p>
                      </div>
                    `,
                    hintContent: `${obj.name} — ${obj.concreteClass.toUpperCase()}`,
                    iconContent: obj.concreteClass.toUpperCase(),
                  }}
                  options={{
                    preset: 'islands#blueStretchyIcon',
                    iconColor: '#1d4ed8',
                    balloonPanelMaxMapArea: 0,
                  }}
                  onClick={() => setSelectedObject(obj)}
                />
              ))}
            </Clusterer>
          </Map>
        </div>
      </YMaps>

      {/* Информация о выбранном объекте */}
      {selectedObject && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-50/60 dark:bg-slate-950/80 border-t border-gray-200/50 dark:border-slate-700/60"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedObject.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{selectedObject.description}</p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
              Бетон: {selectedObject.concreteClass.toUpperCase()}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold border border-gray-200/50">
              Тип: {typeLabels[selectedObject.type] || selectedObject.type}
            </span>
          </div>
        </motion.div>
      )}

      {/* Легенда */}
      <div className="p-4 bg-gray-50/60 dark:bg-slate-950/80 border-t border-gray-200/50 dark:border-slate-700/60">
        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Легенда карты</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {Object.entries(typeLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2 text-gray-600">
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
