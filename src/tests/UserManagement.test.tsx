import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserRegistration } from '../pages/UserRegistration';
import { AuthProvider } from '../contexts/AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('UserRegistration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserRegistration />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Nombre Completo')).toBeTruthy();
    expect(screen.getByLabelText('Correo Electrónico')).toBeTruthy();
    expect(screen.getByLabelText('Idioma Preferido')).toBeTruthy();
    expect(screen.getByLabelText('Contraseña')).toBeTruthy();
    expect(screen.getByLabelText('Confirmar Contraseña')).toBeTruthy();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeTruthy();
  });

  it('shows error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserRegistration />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre Completo'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Idioma Preferido'), {
      target: { value: 'es' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), {
      target: { value: 'password456' }
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Las contraseñas no coinciden');
    });
  });

  it('handles successful registration', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserRegistration />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre Completo'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Idioma Preferido'), {
      target: { value: 'es' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/registration-success');
    });
  });

  it('displays link to login page', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserRegistration />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('¿Ya tienes una cuenta?')).toBeTruthy();
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();
  });
});