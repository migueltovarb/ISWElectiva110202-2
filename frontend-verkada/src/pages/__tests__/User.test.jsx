import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Users from '../Users';
import api from '../../api/api';
import userEvent from '@testing-library/user-event';

vi.mock('../../api/api');

describe('Users Component', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] });
  });

  it('renders registration form', () => {
    render(<Users />);
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
  });

  it('renders empty state if no users', async () => {
    render(<Users />);
    await waitFor(() => {
      expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();
    });
  });
});
