import { render, screen, waitFor } from '@testing-library/react';
import Doors from '../Doors';
import api from '../../api/api';

import userEvent from '@testing-library/user-event';

vi.mock('../../api/api');

describe('Doors Component', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] });
  });

  it('renders form inputs and submit button', () => {
    render(<Doors />);
    expect(screen.getByPlaceholderText('Ingresa el nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa la ubicación')).toBeInTheDocument();
    expect(screen.getByText('✨ Registrar Puerta')).toBeInTheDocument();
  });

  it('renders empty state if no doors', async () => {
    render(<Doors />);
    await waitFor(() => {
      expect(screen.getByText('No hay puertas registradas aún')).toBeInTheDocument();
    });
  });
});
