import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FarmsPage } from './pages/FarmsPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { CropPlannerPage } from './pages/CropPlannerPage';
import { FertilizerPage } from './pages/FertilizerPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { ChatPage } from './pages/ChatPage';
import { HistoryPage } from './pages/HistoryPage';
import { useFarms } from './api/hooks';
import { Language } from '@shared/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { data: farms = [] } = useFarms();
  const [activeFarmId, setActiveFarmId] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  useEffect(() => {
    if (farms.length > 0 && !activeFarmId) {
      setActiveFarmId(farms[0].id);
    }
  }, [farms, activeFarmId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#06140e] text-slate-100 font-sans">
      <Navbar
        activeFarmId={activeFarmId}
        onSelectFarm={setActiveFarmId}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage activeFarmId={activeFarmId} />} />
          <Route path="/farms" element={<FarmsPage />} />
          <Route path="/diagnostics" element={<DiagnosticsPage activeFarmId={activeFarmId} />} />
          <Route path="/crop-planner" element={<CropPlannerPage activeFarmId={activeFarmId} />} />
          <Route path="/fertilizer-calc" element={<FertilizerPage activeFarmId={activeFarmId} />} />
          <Route path="/irrigation" element={<IrrigationPage activeFarmId={activeFarmId} />} />
          <Route path="/assistant" element={<ChatPage activeFarmId={activeFarmId} selectedLanguage={selectedLanguage} />} />
          <Route path="/history" element={<HistoryPage activeFarmId={activeFarmId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
