
import React, { useState } from 'react';
import ContentGenerator from './components/ContentGenerator';
import SEOptimizer from './components/SEOptimizer';

type Tab = 'generator' | 'optimizer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generator');

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-6 py-2 text-lg font-semibold rounded-t-lg transition-colors duration-300 focus:outline-none ${
          isActive
            ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400'
            : 'bg-gray-900 text-gray-400 hover:text-white'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Content & SEO Studio
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            
          </p>
        </header>

        <main>
          <div className="border-b border-gray-700">
            <nav className="flex space-x-2">
              <TabButton tabName="generator" label="Content Generator" />
              <TabButton tabName="optimizer" label="SEO Optimizer" />
            </nav>
          </div>
          <div className="mt-6">
            {activeTab === 'generator' ? <ContentGenerator /> : <SEOptimizer />}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Khawaja Abdullah</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
