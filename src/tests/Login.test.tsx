import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';


const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Correo Electrónico')).toBeTruthy();
    expect(screen.getByLabelText('Contraseña')).toBeTruthy();
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
  });

  it('handles successful login', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'admin@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password' }
    });

    fireEvent.click(screen.getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login failure', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'wrong@email.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'wrongpass' }
    });

    fireEvent.click(screen.getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeTruthy();
    });
  });
});
