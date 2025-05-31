import { render, screen, waitFor } from '@testing-library/react';
import Alarms from '../Alarms';
import api from '../../api/api';
import userEvent from '@testing-library/user-event';

vi.mock('../../api/api');

describe('Alarms Component', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] });
  });

  it('renders form inputs and submit button', () => {
    render(<Alarms />);
    expect(screen.getByPlaceholderText('Nombre de la alarma')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descripción de la alarma')).toBeInTheDocument();
    expect(screen.getByText('Guardar Alarma')).toBeInTheDocument();
  });

  it('renders empty state if no alarms', async () => {
    render(<Alarms />);
    await waitFor(() => {
      expect(screen.getByText('No hay alarmas registradas')).toBeInTheDocument();
    });
  });
});
