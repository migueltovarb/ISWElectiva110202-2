import { render, screen, waitFor } from '@testing-library/react';
import Access from '../Access';
import api from '../../api/api';
import userEvent from '@testing-library/user-event';

vi.mock('../../api/api');

describe('Access Component', () => {
  beforeEach(() => {
    api.get.mockImplementation((url) => {
      if (url === 'access/') return Promise.resolve({ data: [] });
      if (url === 'users/') return Promise.resolve({ data: [] });
      if (url === 'doors/') return Promise.resolve({ data: [] });
    });
  });

  it('renders form and submit button', async () => {
    render(<Access />);
    await waitFor(() => {
      expect(screen.getByText('Guardar Permiso')).toBeInTheDocument();
    });
  });

  it('renders empty state message', async () => {
    render(<Access />);
    await waitFor(() => {
      expect(screen.getByText('No hay permisos registrados')).toBeInTheDocument();
    });
  });
});
