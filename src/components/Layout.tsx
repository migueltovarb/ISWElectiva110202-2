import { ReactNode } from 'react';
import { Shield, Users, DoorOpen, LineChart, FileText, Settings, Globe, LogOut, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: typeof Shield;
  roles: string[];
}

export function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: Users, roles: ['admin', 'security'] },
    { path: '/user-management', label: 'Usuarios', icon: Users, roles: ['admin'] },
    { path: '/guest-registration', label: 'Visitantes', icon: UserPlus, roles: ['admin', 'security'] },
    { path: '/door-management', label: 'Puertas', icon: DoorOpen, roles: ['admin', 'security'] },
    { path: '/environmental-monitoring', label: 'Monitoreo', icon: LineChart, roles: ['admin', 'security'] },
    { path: '/export-records', label: 'Registros', icon: FileText, roles: ['admin', 'security'] },
    { path: '/password-policy', label: 'Configuración', icon: Settings, roles: ['admin'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex justify-center flex-1">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-['Playfair_Display'] tracking-wider text-gray-900">
                  Verkada
                </span>
              </div>
              {user && user.role !== 'guest' && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.path}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        <Link
                          to={item.path}
                          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                            location.pathname === item.path
                              ? 'text-indigo-600 bg-indigo-50'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Salir</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}