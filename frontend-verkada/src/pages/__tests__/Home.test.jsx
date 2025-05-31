import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../Home';

describe('Home Component', () => {
  it('renders home page correctly', () => {
    render(<Home />);
    
    expect(screen.getByText('Verkada')).toBeInTheDocument();
    expect(screen.getByText('Bienvenido al Sistema de Control de Acceso')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Puertas')).toBeInTheDocument();
    expect(screen.getByText('Control de Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Registro de Accesos')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Alarmas')).toBeInTheDocument();
  });

  it('displays statistics section', () => {
    render(<Home />);
    
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Monitoreo')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Seguro')).toBeInTheDocument();
    expect(screen.getByText('∞')).toBeInTheDocument();
    expect(screen.getByText('Escalable')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(<Home />);
    
    expect(document.querySelector('.home-container')).toBeInTheDocument();
    expect(document.querySelector('.home-card')).toBeInTheDocument();
    expect(document.querySelector('.features-grid')).toBeInTheDocument();
    expect(document.querySelector('.stats-section')).toBeInTheDocument();
  });
});