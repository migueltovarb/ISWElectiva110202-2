import { useState } from 'react';
import { Shield, Users, DoorOpen, Bell, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface DashboardCard {
  title: string;
  value: string;
  icon: typeof Shield;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  time: string;
}

export function Dashboard() {
  const { allUsers } = useAuth();
  const { t } = useTranslation();

  const cards: DashboardCard[] = [
    { title: 'Usuarios Activos', value: '145', icon: Users, color: 'bg-blue-500' },
    { title: 'Puertas', value: '16', icon: DoorOpen, color: 'bg-green-500' },
    { title: 'Alertas Hoy', value: '9', icon: Bell, color: 'bg-red-500' },
    { title: 'Accesos Hoy', value: '120', icon: Clock, color: 'bg-purple-500' },
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'access',
      description: 'Juan Pérez accedió a Entrada Principal',
      time: 'Hace 5 minutos',
    },
    {
      id: '2',
      type: 'alert',
      description: 'Intento de acceso no autorizado en Sala de Servidores',
      time: 'Hace 15 minutos',
    },
    {
      id: '3',
      type: 'alert',
      description: 'Temperatura elevada en Sala de Servidores',
      time: 'Hace 30 minutos',
    },
    {
      id: '4',
      type: 'access',
      description: 'María González accedió a Cafetería',
      time: 'Hace 45 minutos',
    },
    {
      id: '5',
      type: 'system',
      description: 'Actualización de firmware completada',
      time: 'Hace 1 hora',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Última actualización: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Users */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Usuarios Registrados</h3>
            <div className="space-y-4">
              {allUsers.filter(u => u.role === 'guest').slice(0, 5).map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Registrado: {user.createdAt}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {user.language.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Accesos:</p>
                    <div className="mt-2 space-y-2">
                      {user.doorAccess.map((door) => (
                        <div key={door.doorId} className="flex items-center text-sm">
                          <DoorOpen className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{door.doorName}</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="text-gray-500">
                            {door.startTime} - {door.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 rounded-md p-2 ${
                        activity.type === 'alert' ? 'bg-red-100' :
                        activity.type === 'access' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'alert' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : activity.type === 'access' ? (
                          <DoorOpen className="h-5 w-5 text-green-600" />
                        ) : (
                          <Shield className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}