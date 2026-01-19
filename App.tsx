
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import GeneratorPage from './pages/GeneratorPage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
      
      <Route 
        path="/*"
        element={
          user ? (
            <MainLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/generate" element={<GeneratorPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
    </Routes>
  );
};

export default App;
