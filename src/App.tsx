import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { UserRegistration } from './pages/UserRegistration';
import { RegistrationSuccess } from './pages/RegistrationSuccess';
import { Dashboard } from './pages/Dashboard';
import { GuestDashboard } from './components/GuestDashboard';
import { EnvironmentalMonitoring } from './pages/EnvironmentalMonitoring';
import { ExportarRegistros } from './pages/ExportRecords';
import { PasswordPolicy } from './pages/PasswordPolicy';
import { DoorManagement } from './pages/DoorManagement';
import { UserManagement } from './pages/UserManagement';
import { GuestRegistration } from './pages/GuestRegistration';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

function DashboardRouter() {
  const { user } = useAuth();
  return user?.role === 'guest' ? <GuestDashboard /> : <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route
                path="/user-management"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guest-registration"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <GuestRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/environmental-monitoring"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <EnvironmentalMonitoring />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/export-records"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <ExportarRegistros />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/password-policy"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PasswordPolicy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/door-management"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <DoorManagement />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App