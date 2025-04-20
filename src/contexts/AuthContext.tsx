import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'security' | 'guest' | 'employee' | 'cleaner' | 'it';
export type Language = 'es' | 'en';

interface DoorAccess {
  doorId: string;
  doorName: string;
  startTime: string;
  endTime: string;
  active: boolean;
  days: string[];
}

interface BiometricData {
  fingerprint?: string;
  facialData?: string;
  registeredAt: string;
  lastVerified?: string;
  isVerified: boolean;
}

interface AccessGroup {
  id: string;
  name: string;
  description: string;
  doors: DoorAccess[];
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: Language;
  mobileCredential?: string;
  doorAccess: DoorAccess[];
  createdAt: string;
  biometricData?: BiometricData;
  accessGroup?: AccessGroup;
  failedAttempts: number;
  lastFailedAttempt?: string;
  isBlocked: boolean;
  blockExpiration?: string;
  requiresBiometric: boolean;
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  isAuthenticated: boolean;
  handleFailedAttempt: (userId: string) => void;
  verifyBiometric: (userId: string, biometricData: BiometricData) => Promise<boolean>;
  assignToGroup: (userId: string, groupId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Grupos de acceso predefinidos
const accessGroups: AccessGroup[] = [
  {
    id: 'cleaners',
    name: 'Personal de Limpieza',
    description: 'Acceso a áreas comunes durante horario de limpieza',
    doors: [
      {
        doorId: '1',
        doorName: 'Entrada Principal',
        startTime: '07:00',
        endTime: '16:00',
        active: true,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      {
        doorId: '3',
        doorName: 'Cafetería',
        startTime: '07:00',
        endTime: '16:00',
        active: true,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      }
    ],
    schedule: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '07:00',
      endTime: '16:00'
    }
  },
  {
    id: 'it',
    name: 'Personal de IT',
    description: 'Acceso a salas de servidores y áreas técnicas',
    doors: [
      {
        doorId: '1',
        doorName: 'Entrada Principal',
        startTime: '00:00',
        endTime: '23:59',
        active: true,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      {
        doorId: '2',
        doorName: 'Sala de Servidores',
        startTime: '00:00',
        endTime: '23:59',
        active: true,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    schedule: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      startTime: '00:00',
      endTime: '23:59'
    }
  }
];

// Usuarios iniciales con datos biométricos y grupos
const initialUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    language: 'es',
    createdAt: '2024-03-15',
    doorAccess: [
      { doorId: '1', doorName: 'Entrada Principal', startTime: '00:00', endTime: '23:59', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      { doorId: '2', doorName: 'Sala de Servidores', startTime: '00:00', endTime: '23:59', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    ],
    failedAttempts: 0,
    isBlocked: false,
    requiresBiometric: true,
    biometricData: {
      fingerprint: 'admin-fingerprint-hash',
      facialData: 'admin-facial-data-hash',
      registeredAt: '2024-03-15',
      isVerified: true
    }
  },
  {
    id: '2',
    email: 'security@example.com',
    name: 'Security Officer',
    role: 'security',
    language: 'en',
    createdAt: '2024-03-15',
    doorAccess: [
      { doorId: '1', doorName: 'Entrada Principal', startTime: '07:00', endTime: '19:00', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      { doorId: '2', doorName: 'Sala de Servidores', startTime: '08:00', endTime: '18:00', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    ],
    failedAttempts: 0,
    isBlocked: false,
    requiresBiometric: true,
    biometricData: {
      fingerprint: 'security-fingerprint-hash',
      facialData: 'security-facial-data-hash',
      registeredAt: '2024-03-15',
      isVerified: true
    }
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);

  const handleFailedAttempt = (userId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newAttempts = u.failedAttempts + 1;
        let blockDuration = 0;
        
        // Incrementar duración del bloqueo según intentos fallidos
        if (newAttempts === 3) blockDuration = 5;
        else if (newAttempts === 6) blockDuration = 10;
        else if (newAttempts === 9) blockDuration = 30;
        else if (newAttempts >= 12) blockDuration = 60;

        if (blockDuration > 0) {
          const blockExpiration = new Date();
          blockExpiration.setMinutes(blockExpiration.getMinutes() + blockDuration);
          
          return {
            ...u,
            failedAttempts: newAttempts,
            isBlocked: true,
            blockExpiration: blockExpiration.toISOString(),
            lastFailedAttempt: new Date().toISOString()
          };
        }

        return {
          ...u,
          failedAttempts: newAttempts,
          lastFailedAttempt: new Date().toISOString()
        };
      }
      return u;
    }));
  };

  const verifyBiometric = async (userId: string, biometricData: BiometricData): Promise<boolean> => {
    // Simulación de verificación biométrica
    const user = allUsers.find(u => u.id === userId);
    if (!user || !user.biometricData) return false;

    // En un sistema real, aquí iría la lógica de comparación biométrica
    const isMatch = true; // Simulamos que siempre coincide

    if (isMatch) {
      setAllUsers(prev => prev.map(u => 
        u.id === userId 
          ? {
              ...u,
              biometricData: {
                ...u.biometricData!,
                lastVerified: new Date().toISOString(),
                isVerified: true
              }
            }
          : u
      ));
    }

    return isMatch;
  };

  const assignToGroup = async (userId: string, groupId: string): Promise<void> => {
    const group = accessGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Grupo no encontrado');

    setAllUsers(prev => prev.map(u => 
      u.id === userId 
        ? {
            ...u,
            accessGroup: group,
            doorAccess: group.doors
          }
        : u
    ));
  };

  const login = async (email: string, password: string) => {
    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
      // Verificar si el usuario está bloqueado
      if (foundUser.isBlocked) {
        const blockExpiration = new Date(foundUser.blockExpiration!);
        if (blockExpiration > new Date()) {
          throw new Error(`Cuenta bloqueada. Intente nuevamente en ${Math.ceil((blockExpiration.getTime() - new Date().getTime()) / 60000)} minutos`);
        } else {
          // Desbloquear si ya pasó el tiempo
          foundUser.isBlocked = false;
          foundUser.failedAttempts = 0;
        }
      }

      // Verificar contraseña
      if (password === 'password') {
        // Resetear intentos fallidos
        foundUser.failedAttempts = 0;
        foundUser.isBlocked = false;
        
        setUser(foundUser);
        return;
      } else {
        handleFailedAttempt(foundUser.id);
        throw new Error('Credenciales inválidas');
      }
    }

    throw new Error('Usuario no encontrado');
  };

  const logout = () => {
    setUser(null);
  };

  const registerUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    const existingUser = allUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      failedAttempts: 0,
      isBlocked: false,
      requiresBiometric: true
    };

    setAllUsers(prev => [...prev, newUser]);
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        login,
        logout,
        registerUser,
        isAuthenticated: !!user,
        handleFailedAttempt,
        verifyBiometric,
        assignToGroup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}