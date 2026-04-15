import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CatalogSection from './components/CatalogSection';
import SimulationPanel from './components/SimulationPanel';
import MapModule from './components/MapModule';
import MixSelector from './components/MixSelector';
import ComparatorModule from './components/ComparatorModule';
import WhatIfModule from './components/WhatIfModule';
import { concreteClasses, getConcreteById } from './data/concreteData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem('betonviz-theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('betonviz-theme', theme);
  }, [theme]);

  const selectedClass = selectedClassId ? getConcreteById(selectedClassId) || null : null;

  const handleSelectConcrete = (id: string) => {
    setSelectedClassId(prev => prev === id ? null : id);
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-[#06132e] text-slate-900 dark:text-slate-100`}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeToggle={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
      />

      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Каталог бетона */}
          {activeTab === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/70 rounded-xl p-6 shadow-lg overflow-visible">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Каталог классов бетона</h2>
                <p className="text-gray-600 dark:text-slate-300 mb-6">
                  Выберите класс бетона для просмотра характеристик и проведения виртуального испытания.
                  Нажмите кнопку «Показать детали» на выбранной карточке — она откроется внутри карточки и сдвинет другие вниз.
                </p>
                <CatalogSection
                  concreteClasses={concreteClasses}
                  selectedId={selectedClassId}
                  onSelect={handleSelectConcrete}
                />
              </div>

              {/* Панель симуляции */}
              {selectedClass && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <div>
                    <SimulationPanel selectedClass={selectedClass} />
                  </div>
                  <div className="space-y-6">
                    <WhatIfModule selectedClass={selectedClass} />
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* Карта применения */}
          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MapModule selectedClass={selectedClass} />
            </motion.div>
          )}

          {/* Подбор смеси */}
          {activeTab === 'mix-selector' && (
            <motion.div
              key="mix-selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MixSelector />
            </motion.div>
          )}

          {/* Компаратор */}
          {activeTab === 'comparator' && (
            <motion.div
              key="comparator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ComparatorModule selectedClass={selectedClass} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Футер */}
      <footer className="bg-slate-900/95 backdrop-blur-sm text-slate-300 py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            БетонВиз - Система визуализации физических свойств бетона
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Проект для ТехноОлимпа | Команда Neiro-DnD
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
