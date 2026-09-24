import React from 'react';
import { EcosystemProvider, useEcosystem } from './context/EcosystemContext';
import { TopNavigation } from './components/common/TopNavigation';
import { CustomerApp } from './components/customer/CustomerApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AutomationEngine } from './components/automation/AutomationEngine';
import { BackendConsole } from './components/backend/BackendConsole';
import { RoadmapGuide } from './components/roadmap/RoadmapGuide';

const MainViewRouter: React.FC = () => {
  const { currentPerspective } = useEcosystem();

  switch (currentPerspective) {
    case 'CUSTOMER':
      return <CustomerApp />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'AUTOMATION':
      return <AutomationEngine />;
    case 'BACKEND':
      return <BackendConsole />;
    case 'ROADMAP':
      return <RoadmapGuide />;
    default:
      return <CustomerApp />;
  }
};

export default function App() {
  return (
    <EcosystemProvider>
      <div className="min-h-screen flex flex-col bg-[#0d0f17] text-slate-100 selection:bg-amber-400 selection:text-black">
        {/* Unified Top Navigation */}
        <TopNavigation />

        {/* Dynamic Viewport */}
        <main className="flex-1">
          <MainViewRouter />
        </main>

        {/* Refined Domain-Compliant Footer */}
        <footer className="border-t border-slate-800/80 bg-[#0a0c12] py-6 px-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-400 font-semibold">Mini-Noon Architecture & Operations Ecosystem</span>
              <span>·</span>
              <span>Flutter + NestJS + PostgreSQL + n8n</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span>القاهرة، مصر</span>
              <span>·</span>
              <span>جميع الحقوق محفوظة {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </EcosystemProvider>
  );
}
