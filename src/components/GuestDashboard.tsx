import { useState } from 'react';
import { DoorOpen, Clock, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function GuestDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome, {user.name}
              </h2>
              <p className="text-indigo-100 mt-1">
                Estas son tus puertas de acceso:
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {user.doorAccess.map((door) => (
              <div
                key={door.doorId}
                className="bg-white border rounded-xl p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <DoorOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{door.doorName}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {door.startTime} - {door.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      door.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {door.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Horario de Acceso
          </h3>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Tu acceso está programado para los siguientes horarios:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.doorAccess.map((door) => (
              <div
                key={door.doorId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700">{door.doorName}</span>
                <span className="text-sm text-gray-600">
                  {door.startTime} - {door.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}