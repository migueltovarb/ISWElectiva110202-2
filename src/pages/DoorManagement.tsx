import { useState, useEffect } from 'react';
import { MapPin, Lock, DoorOpen, Plus, Search, AlertTriangle, Bell, Shield, Key, Smartphone, QrCode, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessType {
  id: string;
  name: string;
  icon: typeof Key;
  enabled: boolean;
}

interface Door {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'locked' | 'unlocked' | 'forced';
  accessTypes: AccessType[];
  lastIncident?: {
    type: 'forced' | 'unauthorized' | 'tamper';
    timestamp: string;
    description: string;
  };
}

interface Alert {
  id: string;
  doorId: string;
  doorName: string;
  type: 'forced' | 'unauthorized' | 'tamper';
  timestamp: string;
  description: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export function DoorManagement() {
  const [doors, setDoors] = useState<Door[]>([
    {
      id: '1',
      name: 'Entrada Principal',
      location: 'Planta Baja',
      type: 'RFID',
      status: 'locked',
      accessTypes: [
        { id: 'rfid', name: 'Tarjeta RFID', icon: Key, enabled: true },
        { id: 'pin', name: 'Código PIN', icon: Key, enabled: true },
        { id: 'qr', name: 'Código QR', icon: QrCode, enabled: true },
        { id: 'biometric', name: 'Biométrico', icon: Fingerprint, enabled: true },
        { id: 'mobile', name: 'Móvil', icon: Smartphone, enabled: false },
      ]
    },
    {
      id: '2',
      name: 'Sala de Servidores',
      location: 'Sótano',
      type: 'RFID + PIN',
      status: 'locked',
      accessTypes: [
        { id: 'rfid', name: 'Tarjeta RFID', icon: Key, enabled: true },
        { id: 'pin', name: 'Código PIN', icon: Key, enabled: true },
        { id: 'qr', name: 'Código QR', icon: QrCode, enabled: false },
        { id: 'biometric', name: 'Biométrico', icon: Fingerprint, enabled: true },
        { id: 'mobile', name: 'Móvil', icon: Smartphone, enabled: false },
      ]
    },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAccessTypes, setShowAccessTypes] = useState<string | null>(null);
  const [newDoor, setNewDoor] = useState({
    name: '',
    location: '',
    type: '',
  });

  // Simular eventos de puertas forzadas
  useEffect(() => {
    const interval = setInterval(() => {
      const randomDoor = doors[Math.floor(Math.random() * doors.length)];
      if (Math.random() < 0.3) { // 30% de probabilidad de generar una alerta
        const alertTypes = ['forced', 'unauthorized', 'tamper'] as const;
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const newAlert: Alert = {
          id: Math.random().toString(36).substr(2, 9),
          doorId: randomDoor.id,
          doorName: randomDoor.name,
          type: alertType,
          timestamp: new Date().toISOString(),
          description: getAlertDescription(alertType, randomDoor.name),
          status: 'new'
        };

        setAlerts(prev => [newAlert, ...prev]);
        
        // Actualizar el estado de la puerta
        setDoors(prev => prev.map(door => 
          door.id === randomDoor.id 
            ? { 
                ...door, 
                status: 'forced',
                lastIncident: {
                  type: alertType,
                  timestamp: new Date().toISOString(),
                  description: getAlertDescription(alertType, door.name)
                }
              }
            : door
        ));

        // Notificar al usuario
        if (Notification.permission === 'granted') {
          new Notification('Alerta de Seguridad', {
            body: getAlertDescription(alertType, randomDoor.name),
            icon: '/alert-icon.png'
          });
        }
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [doors]);

  const getAlertDescription = (type: Alert['type'], doorName: string) => {
    switch (type) {
      case 'forced':
        return `¡Puerta forzada detectada! ${doorName}`;
      case 'unauthorized':
        return `Intento de acceso no autorizado en ${doorName}`;
      case 'tamper':
        return `Manipulación detectada en ${doorName}`;
      default:
        return `Incidente de seguridad en ${doorName}`;
    }
  };

  const handleAddDoor = (e: React.FormEvent) => {
    e.preventDefault();
    const door: Door = {
      id: Math.random().toString(36).substr(2, 9),
      ...newDoor,
      status: 'locked',
      accessTypes: [
        { id: 'rfid', name: 'Tarjeta RFID', icon: Key, enabled: true },
        { id: 'pin', name: 'Código PIN', icon: Key, enabled: true },
        { id: 'qr', name: 'Código QR', icon: QrCode, enabled: true },
        { id: 'biometric', name: 'Biométrico', icon: Fingerprint, enabled: false },
        { id: 'mobile', name: 'Móvil', icon: Smartphone, enabled: false },
      ]
    };
    setDoors([...doors, door]);
    setShowAddForm(false);
    setNewDoor({ name: '', location: '', type: '' });
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));
  };

  const handleResolveAlert = (alertId: string, doorId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'resolved' }
        : alert
    ));

    setDoors(prev => prev.map(door =>
      door.id === doorId
        ? { ...door, status: 'locked', lastIncident: undefined }
        : door
    ));
  };

  const toggleAccessType = (doorId: string, accessTypeId: string) => {
    setDoors(prev => prev.map(door => 
      door.id === doorId
        ? {
            ...door,
            accessTypes: door.accessTypes.map(type => 
              type.id === accessTypeId
                ? { ...type, enabled: !type.enabled }
                : type
            )
          }
        : door
    ));
  };

  const getAlertStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Puertas</h2>
        <div className="flex space-x-4">
          <Button 
            variant={showAlerts ? 'primary' : 'outline'}
            onClick={() => setShowAlerts(!showAlerts)}
          >
            <Bell className="h-4 w-4 mr-2" />
            Alertas
            {alerts.filter(a => a.status === 'new').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                {alerts.filter(a => a.status === 'new').length}
              </span>
            )}
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Puerta
          </Button>
        </div>
      </div>

      {/* Panel de Alertas */}
      <AnimatePresence>
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Alertas de Seguridad
              </h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No hay alertas pendientes
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          alert.type === 'forced' ? 'bg-red-100' :
                          alert.type === 'unauthorized' ? 'bg-yellow-100' :
                          'bg-orange-100'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            alert.type === 'forced' ? 'text-red-600' :
                            alert.type === 'unauthorized' ? 'text-yellow-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {alert.description}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getAlertStatusColor(alert.status)
                        }`}>
                          {alert.status === 'new' ? 'Nuevo' :
                           alert.status === 'acknowledged' ? 'En proceso' :
                           'Resuelto'}
                        </span>
                        {alert.status === 'new' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Atender
                          </Button>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Button
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id, alert.doorId)}
                          >
                            Resolver
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Puertas */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Buscar puertas..."
                />
              </div>
            </div>
            <Select defaultValue="all">
              <option value="all">Todos los tipos</option>
              <option value="rfid">RFID</option>
              <option value="pin">PIN</option>
              <option value="mobile">Móvil</option>
            </Select>
          </div>
        </div>

        <div className="divide-y">
          {doors.map((door) => (
            <motion.div
              key={door.id}
              className="p-6"
              animate={{
                backgroundColor: door.status === 'forced' ? '#FEF2F2' : '#FFFFFF',
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    door.status === 'forced' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <DoorOpen className={`h-6 w-6 ${
                      door.status === 'forced' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{door.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {door.location}
                    </div>
                    {door.lastIncident && (
                      <div className="mt-2 text-sm text-red-600">
                        {door.lastIncident.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAccessTypes(door.id === showAccessTypes ? null : door.id)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Tipos de Acceso
                  </Button>
                  <Button
                    variant={door.status === 'locked' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => {
                      setDoors(doors.map(d =>
                        d.id === door.id
                          ? { ...d, status: d.status === 'locked' ? 'unlocked' : 'locked' }
                          : d
                      ));
                    }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {door.status === 'locked' ? 'Desbloquear' : 'Bloquear'}
                  </Button>
                </div>
              </div>

              {/* Panel de Tipos de Acceso */}
              <AnimatePresence>
                {showAccessTypes === door.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t"
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Configurar Tipos de Acceso
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {door.accessTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => toggleAccessType(door.id, type.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                              type.enabled 
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                                : 'border-gray-200 text-gray-400'
                            }`}
                          >
                            <Icon className="h-6 w-6 mb-2" />
                            <span className="text-sm font-medium">{type.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> Los tipos de acceso habilitados determinarán qué credenciales pueden usar los usuarios para acceder a esta puerta.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Formulario para agregar puerta */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agregar Nueva Puerta</h3>
              <form onSubmit={handleAddDoor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <Input
                    value={newDoor.name}
                    onChange={(e) => setNewDoor({ ...newDoor, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <Input
                    value={newDoor.location}
                    onChange={(e) => setNewDoor({ ...newDoor, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Lector
                  </label>
                  <Select
                    value={newDoor.type}
                    onChange={(e) => setNewDoor({ ...newDoor, type: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="RFID">RFID</option>
                    <option value="PIN">PIN</option>
                    <option value="RFID + PIN">RFID + PIN</option>
                    <option value="Móvil">Móvil</option>
                    <option value="Biométrico">Biométrico</option>
                    <option value="Múltiple">Múltiple</option>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}