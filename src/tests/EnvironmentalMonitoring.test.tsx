import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnvironmentalMonitoring } from '../pages/EnvironmentalMonitoring';
import { vi } from 'vitest';

// 1. Configuración de mocks esenciales
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// 2. Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 3. Mock completo del componente Select
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onChange }: any) => (
    <select 
      value={value} 
      onChange={onChange} 
      data-testid="door-select"
      role="combobox"
    >
      {children}
    </select>
  ),
}));

// 4. Mock optimizado de Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('<EnvironmentalMonitoring />', () => {
  beforeEach(() => {
    // 5. Configuración de timers y mocks
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // 6. Prueba de cambio de vista
  it('debería cambiar entre vista general y detallada', async () => {
    render(<EnvironmentalMonitoring />);
    
    // Cambio a vista detallada
    fireEvent.click(screen.getByText('Vista Detallada'));
    
    await waitFor(() => {
      expect(screen.getByTestId('door-select')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Cambio a vista general
    fireEvent.click(screen.getByText('Vista General'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('door-select')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  // 7. Prueba de alertas de temperatura
  it('debería mostrar alertas cuando la temperatura es alta', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9); // 24.5°C
    
    render(<EnvironmentalMonitoring />);
    
    // Avanzar el timer para disparar el useEffect
    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.getByText(/Alta temperatura en/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  // 8. Prueba de filtrado por puerta
  it('debería filtrar datos al seleccionar una puerta', async () => {
    render(<EnvironmentalMonitoring />);
    
    // Cambiar a vista detallada
    fireEvent.click(screen.getByText('Vista Detallada'));
    
    // Esperar y seleccionar puerta
    const select = await screen.findByTestId('door-select', {}, { timeout: 5000 });
    fireEvent.change(select, { target: { value: '1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Entrada Principal')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  // 9. Prueba de actualización de gráfico
  it('debería actualizar el gráfico al cambiar la puerta seleccionada', async () => {
    render(<EnvironmentalMonitoring />);
    
    // Cambiar a vista detallada
    fireEvent.click(screen.getByText('Vista Detallada'));
    
    // Esperar y seleccionar puerta diferente
    const select = await screen.findByTestId('door-select', {}, { timeout: 5000 });
    fireEvent.change(select, { target: { value: '2' } });
    
    await waitFor(() => {
      expect(screen.getByText('Sala de Servidores')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});