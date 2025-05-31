// src/pages/__tests__/Nav.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav from '../../components/Nav';

// Mock de useLocation con una función que puede ser modificada
const mockUseLocation = vi.fn();

// Mock completo de react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, className, children, ...props }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useLocation: () => mockUseLocation()
}));

// Mock del CSS para evitar errores
vi.mock('../../pages/Nav.css', () => ({}));

describe('Nav Component', () => {
  beforeEach(() => {
    // Reset del mock antes de cada test
    mockUseLocation.mockReturnValue({ pathname: '/' });
  });

  it('renders the brand correctly', () => {
    render(<Nav />);
    
    expect(screen.getByText('🔐')).toBeInTheDocument();
    expect(screen.getByText('Verkada')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<Nav />);
    
    // Verificar que todos los elementos de navegación están presentes
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    
    expect(screen.getByText('🚪')).toBeInTheDocument();
    expect(screen.getByText('Puertas')).toBeInTheDocument();
    
    expect(screen.getByText('👥')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('Accesos')).toBeInTheDocument();
    
    expect(screen.getByText('🚨')).toBeInTheDocument();
    expect(screen.getByText('Alarmas')).toBeInTheDocument();
  });

  it('renders all navigation links with correct paths', () => {
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    
    // Verificar que los links tienen las rutas correctas
    expect(links.find(link => link.getAttribute('href') === '/')).toBeInTheDocument();
    expect(links.find(link => link.getAttribute('href') === '/doors')).toBeInTheDocument();
    expect(links.find(link => link.getAttribute('href') === '/users')).toBeInTheDocument();
    expect(links.find(link => link.getAttribute('href') === '/access')).toBeInTheDocument();
    expect(links.find(link => link.getAttribute('href') === '/alarms')).toBeInTheDocument();
  });

  it('renders user section correctly', () => {
    render(<Nav />);
    
    expect(screen.getByText('👤')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('has correct CSS classes on elements', () => {
    render(<Nav />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('nav-container');
    
    // Verificar que todos los links tienen la clase base
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('nav-link');
    });
  });

  it('renders correct number of navigation items', () => {
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5); // 5 elementos de navegación
  });

  it('displays all navigation icons correctly', () => {
    render(<Nav />);
    
    const expectedIcons = ['🏠', '🚪', '👥', '📊', '🚨'];
    expectedIcons.forEach(icon => {
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });

  it('displays all navigation labels correctly', () => {
    render(<Nav />);
    
    const expectedLabels = ['Inicio', 'Puertas', 'Usuarios', 'Accesos', 'Alarmas'];
    expectedLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('applies active class to home route by default', () => {
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    
    expect(homeLink).toHaveClass('nav-link-active');
  });
});

// Test adicional para diferentes rutas activas
describe('Nav Component - Active States', () => {
  beforeEach(() => {
    // Reset del mock antes de cada test
    mockUseLocation.mockClear();
  });

  it('applies active class when on doors route', () => {
    // Mock useLocation para simular ruta /doors
    mockUseLocation.mockReturnValue({ pathname: '/doors' });
    
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    const doorsLink = links.find(link => link.getAttribute('href') === '/doors');
    
    expect(doorsLink).toHaveClass('nav-link-active');
  });

  it('applies active class when on users route', () => {
    // Mock useLocation para simular ruta /users
    mockUseLocation.mockReturnValue({ pathname: '/users' });
    
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    const usersLink = links.find(link => link.getAttribute('href') === '/users');
    
    expect(usersLink).toHaveClass('nav-link-active');
  });

  it('applies active class when on access route', () => {
    // Mock useLocation para simular ruta /access
    mockUseLocation.mockReturnValue({ pathname: '/access' });
    
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    const accessLink = links.find(link => link.getAttribute('href') === '/access');
    
    expect(accessLink).toHaveClass('nav-link-active');
  });

  it('applies active class when on alarms route', () => {
    // Mock useLocation para simular ruta /alarms
    mockUseLocation.mockReturnValue({ pathname: '/alarms' });
    
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    const alarmsLink = links.find(link => link.getAttribute('href') === '/alarms');
    
    expect(alarmsLink).toHaveClass('nav-link-active');
  });

  it('does not apply active class to non-current routes', () => {
    // Mock useLocation para simular ruta /doors
    mockUseLocation.mockReturnValue({ pathname: '/doors' });
    
    render(<Nav />);
    
    const links = screen.getAllByRole('link');
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    const usersLink = links.find(link => link.getAttribute('href') === '/users');
    
    expect(homeLink).not.toHaveClass('nav-link-active');
    expect(usersLink).not.toHaveClass('nav-link-active');
  });
});