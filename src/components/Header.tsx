import React from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, theme, onThemeToggle }) => {
  const tabs = [
    { id: 'catalog', label: 'Каталог бетона' },
    { id: 'map', label: 'Карта применения' },
    { id: 'mix-selector', label: 'Подбор смеси' },
    { id: 'comparator', label: 'Компаратор' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 dark:from-slate-950 dark:to-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">БетонВиз</h1>
              <p className="text-sm text-blue-100 dark:text-slate-300">Визуализация свойств бетона</p>
            </div>
            <button
              type="button"
              onClick={onThemeToggle}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors duration-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label={theme === 'dark' ? 'Переключиться в светлую тему' : 'Переключиться в тёмную тему'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <nav className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-md dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white/10 hover:bg-white/20 text-white dark:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
