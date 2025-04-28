import { describe, beforeEach, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../pages/Dashboard';
import * as AuthContext from '@/contexts/AuthContext';
import * as ReactI18Next from 'react-i18next';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  createdAt: string;
  doorAccess: Array<{
    doorId: string;
    doorName: string;
    startTime: string;
    endTime: string;
  }>;
}

interface AuthContextType {
  allUsers: User[];
}


vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('Dashboard Component', () => {
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'guest',
      language: 'es',
      createdAt: '2023-01-01',
      doorAccess: [
        { doorId: '1', doorName: 'Entrada Principal', startTime: '08:00', endTime: '18:00' }
      ]
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@example.com',
      role: 'guest',
      language: 'es',
      createdAt: '2023-01-02',
      doorAccess: [
        { doorId: '2', doorName: 'Cafetería', startTime: '09:00', endTime: '17:00' }
      ]
    }
  ];

  beforeEach(() => {

    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => ({
      allUsers: mockUsers
    } as AuthContextType));

    vi.spyOn(ReactI18Next, 'useTranslation').mockImplementation(() => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => Promise.resolve(),
        language: 'es',
        languages: ['es', 'en'],
        resolvedLanguage: 'es',
        options: {},
        isInitialized: true,
        getFixedT: () => (key: string) => key,
        hasResourceBundle: () => true,
        loadNamespaces: () => Promise.resolve(),
        loadLanguages: () => Promise.resolve(),
        reloadResources: () => Promise.resolve(),
      }
    }));

 
    const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString = vi.fn(() => '10:30:00');

    return () => {
      Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
    };
  });

  test('renders Dashboard title correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('Panel de Control')).toBeInTheDocument();
  });

  test('renders dashboard cards correctly', () => {
    render(<Dashboard />);
    
   
    expect(screen.getByText('Usuarios Activos')).toBeInTheDocument();
    expect(screen.getByText('Puertas')).toBeInTheDocument();
    expect(screen.getByText('Alertas Hoy')).toBeInTheDocument();
    expect(screen.getByText('Accesos Hoy')).toBeInTheDocument();
    

    expect(screen.getByText('145')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  test('renders Registered Users section correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Usuarios Registrados')).toBeInTheDocument();
    

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
    
    expect(screen.getByText('Entrada Principal')).toBeInTheDocument();
    expect(screen.getByText('Cafetería')).toBeInTheDocument();
  });

  test('renders Recent Activity section correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Actividad Reciente')).toBeInTheDocument();
    

    expect(screen.getByText('Juan Pérez accedió a Entrada Principal')).toBeInTheDocument();
    expect(screen.getByText('Intento de acceso no autorizado en Sala de Servidores')).toBeInTheDocument();
    expect(screen.getByText('Temperatura elevada en Sala de Servidores')).toBeInTheDocument();
    expect(screen.getByText('María González accedió a Cafetería')).toBeInTheDocument();
    expect(screen.getByText('Actualización de firmware completada')).toBeInTheDocument();
    
    expect(screen.getByText('Hace 5 minutos')).toBeInTheDocument();
    expect(screen.getByText('Hace 15 minutos')).toBeInTheDocument();
    expect(screen.getByText('Hace 30 minutos')).toBeInTheDocument();
    expect(screen.getByText('Hace 45 minutos')).toBeInTheDocument();
    expect(screen.getByText('Hace 1 hora')).toBeInTheDocument();
  });

  test('displays the last update time correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('Última actualización: 10:30:00')).toBeInTheDocument();
  });
});
