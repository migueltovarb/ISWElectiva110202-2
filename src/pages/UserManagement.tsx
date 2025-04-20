import { useState } from 'react';
import { User, UserPlus, Key, Lock, Shield, Search, MoreVertical, AlertTriangle, Clock, Calendar, Plus, X, Camera, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import type { User as UserType, UserRole } from '@/contexts/AuthContext';

interface AccessSchedule {
  id: string;
  doorId: string;
  doorName: string;
  days: string[];
  startTime: string;
  endTime: string;
}

interface UserCredential {
  type: 'rfid' | 'pin' | 'mobile' | 'biometric';
  value: string;
  issuedAt: string;
  expiresAt?: string;
  isActive: boolean;
  failedAttempts: number;
  lastFailedAttempt?: string;
  isBlocked: boolean;
  blockExpiration?: string;
}

interface ExtendedUser extends UserType {
  status: 'active' | 'blocked';
  credentials: UserCredential[];
  accessSchedules: AccessSchedule[];
}

interface NewUserForm {
  name: string;
  email: string;
  role: UserRole;
  language: 'es' | 'en';
  requiresBiometric: boolean;
}

interface NewCredentialForm {
  type: UserCredential['type'];
  value: string;
  expiresAt?: string;
}

interface NewScheduleForm {
  doorId: string;
  doorName: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export function UserManagement() {
  const { allUsers, registerUser, assignToGroup, verifyBiometric } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [showCredentials, setShowCredentials] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [showAddCredential, setShowAddCredential] = useState<string | null>(null);
  const [showAddSchedule, setShowAddSchedule] = useState<string | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAssignGroup, setShowAssignGroup] = useState<string | null>(null);
  const [showBiometricRegistration, setShowBiometricRegistration] = useState<string | null>(null);
  const [biometricStep, setBiometricStep] = useState<'fingerprint' | 'facial'>('fingerprint');

  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    role: 'employee',
    language: 'es',
    requiresBiometric: true
  });

  const [newCredential, setNewCredential] = useState<NewCredentialForm>({
    type: 'rfid',
    value: '',
    expiresAt: ''
  });

  const [newSchedule, setNewSchedule] = useState<NewScheduleForm>({
    doorId: '1',
    doorName: 'Entrada Principal',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    startTime: '09:00',
    endTime: '18:00'
  });

  // Extend users with additional properties
  const extendedUsers: ExtendedUser[] = allUsers.map(user => ({
    ...user,
    status: user.isBlocked ? 'blocked' : 'active',
    credentials: [
      ...(user.biometricData ? [{
        type: 'biometric',
        value: 'Datos biométricos registrados',
        issuedAt: user.biometricData.registeredAt,
        isActive: user.biometricData.isVerified,
        failedAttempts: 0,
        isBlocked: false
      }] : []),
      {
        type: 'rfid',
        value: '5A:2B:3C:4D',
        issuedAt: user.createdAt,
        isActive: true,
        failedAttempts: 0,
        isBlocked: false
      },
      {
        type: 'pin',
        value: '****',
        issuedAt: user.createdAt,
        isActive: true,
        failedAttempts: 0,
        isBlocked: false
      }
    ],
    accessSchedules: user.doorAccess.map(door => ({
      id: door.doorId,
      doorId: door.doorId,
      doorName: door.doorName,
      days: door.days,
      startTime: door.startTime,
      endTime: door.endTime
    }))
  }));

  const availableDoors = [
    { id: '1', name: 'Entrada Principal' },
    { id: '2', name: 'Sala de Servidores' },
    { id: '3', name: 'Cafetería' },
    { id: '4', name: 'Sala de Reuniones A' },
    { id: '5', name: 'Sala de Reuniones B' },
    { id: '6', name: 'Oficinas Administrativas' },
  ];

  const availableGroups = [
    { id: 'cleaners', name: 'Personal de Limpieza' },
    { id: 'it', name: 'Personal de IT' },
    { id: 'admin', name: 'Administradores' },
    { id: 'security', name: 'Personal de Seguridad' },
    { id: 'employees', name: 'Empleados Generales' },
  ];

  const filteredUsers = extendedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        ...newUser,
        doorAccess: [
          {
            doorId: '1',
            doorName: 'Entrada Principal',
            startTime: '09:00',
            endTime: '17:00',
            active: true,
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
          },
        ],
      });
      setShowAddUser(false);
      setNewUser({
        name: '',
        email: '',
        role: 'employee',
        language: 'es',
        requiresBiometric: true
      });
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  const handleBlockUser = (userId: string) => {
    // Implementar lógica de bloqueo
    console.log(`Bloqueando usuario ${userId}`);
    setShowBlockConfirm(null);
  };

  const handleDeleteUser = (userId: string) => {
    // Implementar lógica de eliminación
    console.log(`Eliminando usuario ${userId}`);
    setShowDeleteConfirm(null);
  };

  const handleAddCredential = (userId: string) => {
    // Implementar lógica de agregar credencial
    console.log(`Agregando credencial ${newCredential.type} al usuario ${userId}`);
    setShowAddCredential(null);
  };

  const handleAddSchedule = (userId: string) => {
    // Implementar lógica de agregar horario
    console.log(`Agregando horario para la puerta ${newSchedule.doorId} al usuario ${userId}`);
    setShowAddSchedule(null);
  };

  const handleAssignGroup = async (userId: string, groupId: string) => {
    try {
      await assignToGroup(userId, groupId);
      setShowAssignGroup(null);
    } catch (error) {
      console.error('Error al asignar grupo:', error);
    }
  };

  const handleDayToggle = (day: string) => {
    setNewSchedule(prev => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  const handleBiometricRegistration = async (userId: string) => {
    if (biometricStep === 'fingerprint') {
      // Simular registro de huella
      console.log('Registrando huella digital...');
      setBiometricStep('facial');
    } else {
      // Simular registro facial
      console.log('Registrando datos faciales...');
      
      const mockBiometricData = {
        fingerprint: 'new-fingerprint-hash',
        facialData: 'new-facial-data-hash',
        registeredAt: new Date().toISOString(),
        isVerified: true
      };

      try {
        await verifyBiometric(userId, mockBiometricData);
        setShowBiometricRegistration(null);
        setBiometricStep('fingerprint');
      } catch (error) {
        console.error('Error en registro biométrico:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
        <Button onClick={() => setShowAddUser(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            className="w-48"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="security">Seguridad</option>
            <option value="guest">Invitado</option>
            <option value="employee">Empleado</option>
            <option value="cleaner">Personal de Limpieza</option>
            <option value="it">Personal de IT</option>
          </Select>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">Rol: {user.role}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Activo' : 'Bloqueado'}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCredentials(user.id === showCredentials ? null : user.id)}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Credenciales
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSchedule(user.id === showSchedule ? null : user.id)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Horarios
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAssignGroup(user.id)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Grupo
                    </Button>
                    <Button
                      variant={user.status === 'active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => setShowBlockConfirm(user.id)}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(user.id)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Panel de Credenciales */}
              {showCredentials === user.id && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Credenciales Asignadas</h4>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => setShowBiometricRegistration(user.id)}
                        variant={user.biometricData ? 'outline' : 'primary'}
                      >
                        <Fingerprint className="h-4 w-4 mr-2" />
                        {user.biometricData ? 'Actualizar Biométricos' : 'Registrar Biométricos'}
                      </Button>
                      <Button size="sm" onClick={() => setShowAddCredential(user.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Credencial
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.credentials.map((credential, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {credential.type === 'rfid' ? 'Tarjeta RFID' : 
                             credential.type === 'pin' ? 'Código PIN' : 
                             credential.type === 'mobile' ? 'Credencial Móvil' : 
                             'Datos Biométricos'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {credential.type === 'biometric' ? 
                              'Huella digital y reconocimiento facial' : 
                              credential.value}
                          </div>
                          <div className="text-sm text-gray-500">
                            Emitido: {credential.issuedAt}
                          </div>
                          {credential.isBlocked && (
                            <div className="text-sm text-red-600">
                              Bloqueado hasta: {credential.blockExpiration}
                            </div>
                          )}
                          {credential.failedAttempts > 0 && (
                            <div className="text-sm text-amber-600">
                              Intentos fallidos: {credential.failedAttempts}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant={credential.isActive ? 'outline' : 'primary'}
                            size="sm"
                          >
                            {credential.isActive ? 'Revocar' : 'Activar'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Panel de Horarios */}
              {showSchedule === user.id && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Horarios de Acceso</h4>
                    <Button size="sm" onClick={() => setShowAddSchedule(user.id)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Agregar Horario
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {user.accessSchedules.map((schedule) => (
                      <div key={schedule.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              Puerta: {schedule.doorName}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Días: {schedule.days.join(', ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Horario: {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                
                              Editar
                            </Button>
                            <Button size="sm" variant="danger">
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar usuario */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Usuario</h3>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <Select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    required
                  >
                    <option value="admin">Administrador</option>
                    <option value="security">Seguridad</option>
                    <option value="guest">Invitado</option>
                    <option value="employee">Empleado</option>
                    <option value="cleaner">Personal de Limpieza</option>
                    <option value="it">Personal de IT</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idioma
                  </label>
                  <Select
                    value={newUser.language}
                    onChange={(e) => setNewUser({ ...newUser, language: e.target.value as 'es' | 'en' })}
                    required
                  >
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                  </Select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requiresBiometric"
                    checked={newUser.requiresBiometric}
                    onChange={(e) => setNewUser({ ...newUser, requiresBiometric: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requiresBiometric" className="ml-2 block text-sm text-gray-900">
                    Requiere verificación biométrica
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddUser(false)}
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

      {/* Modal para agregar credencial */}
      {showAddCredential && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agregar Nueva Credencial</h3>
                <button
                  onClick={() => setShowAddCredential(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddCredential(showAddCredential); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Credencial
                  </label>
                  <Select
                    value={newCredential.type}
                    onChange={(e) => setNewCredential({ ...newCredential, type: e.target.value as UserCredential['type'] })}
                    required
                  >
                    <option value="rfid">Tarjeta RFID</option>
                    <option value="pin">Código PIN</option>
                    <option value="mobile">Credencial Móvil</option>
                    <option value="biometric">Datos Biométricos</option>
                  </Select>
                </div>
                {newCredential.type !== 'biometric' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor
                    </label>
                    <Input
                      value={newCredential.value}
                      onChange={(e) => setNewCredential({ ...newCredential, value: e.target.value })}
                      placeholder={newCredential.type === 'rfid' ? 'ID de la tarjeta' : 
                                  newCredential.type === 'pin' ? 'Código PIN' : 
                                  'Identificador del dispositivo'}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Expiración (opcional)
                  </label>
                  <Input
                    type="date"
                    value={newCredential.expiresAt}
                    onChange={(e) => setNewCredential({ ...newCredential, expiresAt: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCredential(null)}
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

      {/* Modal para agregar horario */}
      {showAddSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Horario</h3>
                <button
                  onClick={() => setShowAddSchedule(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddSchedule(showAddSchedule); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Puerta
                  </label>
                  <Select
                    value={newSchedule.doorId}
                    onChange={(e) => {
                      const door = availableDoors.find(d => d.id === e.target.value);
                      setNewSchedule({ 
                        ...newSchedule, 
                        doorId: e.target.value,
                        doorName: door ? door.name : ''
                      });
                    }}
                    required
                  >
                    {availableDoors.map(door => (
                      <option key={door.id} value={door.id}>{door.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Días de la Semana
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`p-2 text-xs font-medium rounded ${
                          newSchedule.days.includes(day)
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        } border`}
                      >
                        {day === 'Mon' ? 'Lun' :
                         day === 'Tue' ? 'Mar' :
                         day === 'Wed' ? 'Mié' :
                         day === 'Thu' ? 'Jue' :
                         day === 'Fri' ? 'Vie' :
                         day === 'Sat' ? 'Sáb' : 'Dom'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Inicio
                    </label>
                    <Input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Fin
                    </label>
                    <Input
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddSchedule(null)}
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

      {/* Modal para confirmar bloqueo */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Acción
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                ¿Está seguro que desea {filteredUsers.find(u => u.id === showBlockConfirm)?.status === 'active' ? 'bloquear' : 'desbloquear'} a este usuario?
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBlockConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant={filteredUsers.find(u => u.id === showBlockConfirm)?.status === 'active' ? 'danger' : 'primary'}
                  onClick={() => handleBlockUser(showBlockConfirm)}
                >
                  {filteredUsers.find(u => u.id === showBlockConfirm)?.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para confirmar eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Eliminación
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                ¿Está seguro que desea eliminar a este usuario? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para asignar grupo */}
      {showAssignGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Asignar a Grupo</h3>
                <button
                  onClick={() => setShowAssignGroup(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Seleccione un grupo para asignar al usuario. Esto otorgará automáticamente los permisos y horarios definidos para ese grupo.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {availableGroups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => handleAssignGroup(showAssignGroup, group.id)}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-indigo-500 mr-3" />
                        <span className="font-medium">{group.name}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para registro biométrico */}
      {showBiometricRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Registro Biométrico
                </h3>
                <button
                  onClick={() => {
                    setShowBiometricRegistration(null);
                    setBiometricStep('fingerprint');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center py-8">
                {biometricStep === 'fingerprint' ? (
                  <>
                    <Fingerprint className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Registro de Huella Digital
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Por favor, coloque su dedo en el lector de huellas digitales
                    </p>
                  </>
                ) : (
                  <>
                    <Camera className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Registro Facial
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Por favor, mire directamente a la cámara
                    </p>
                  </>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={() => handleBiometricRegistration(showBiometricRegistration)}
                    className="w-full md:w-auto"
                  >
                    {biometricStep === 'fingerprint' ? 'Registrar Huella' : 'Registrar Rostro'}
                  </Button>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Este proceso requiere hardware biométrico compatible.
                  Asegúrese de que los dispositivos estén correctamente conectados y configurados.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}