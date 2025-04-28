import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordPolicy } from '../pages/PasswordPolicy';
import '@testing-library/jest-dom';
import { expect } from 'vitest';

describe('PasswordPolicy component', () => {
  it('should render all password requirements', () => {
    render(<PasswordPolicy />);

    expect(screen.getByTestId('requirements-list')).toBeInTheDocument();
    expect(screen.getByTestId('requirement-length')).toBeInTheDocument();
    expect(screen.getByTestId('requirement-uppercase')).toBeInTheDocument();
    expect(screen.getByTestId('requirement-lowercase')).toBeInTheDocument();
    expect(screen.getByTestId('requirement-number')).toBeInTheDocument();
    expect(screen.getByTestId('requirement-special')).toBeInTheDocument();
  });

  it('should update requirements based on password input', () => {
    render(<PasswordPolicy />);

    const testInput = screen.getByTestId('password-input'); 

    // Contraseña que cumple algunos requisitos
    fireEvent.change(testInput, { target: { value: 'Test123' } });

    // Verificamos los estados (usando las clases de Tailwind)
    expect(screen.getByTestId('requirement-length')).toHaveClass('text-red-600');
    expect(screen.getByTestId('requirement-uppercase')).toHaveClass('text-green-600');
    expect(screen.getByTestId('requirement-lowercase')).toHaveClass('text-green-600');
    expect(screen.getByTestId('requirement-number')).toHaveClass('text-green-600');
    expect(screen.getByTestId('requirement-special')).toHaveClass('text-red-600');

    // Contraseña que cumple todos los requisitos
    fireEvent.change(testInput, { target: { value: 'Test123!' } });

    // Todos deben estar en verde ahora
    const requirements = [
      'length',
      'uppercase',
      'lowercase',
      'number',
      'special'
    ];
    
    requirements.forEach(req => {
      expect(screen.getByTestId(`requirement-${req}`)).toHaveClass('text-green-600');
    });
  });

  it('should update minimum length requirement when policy changes', () => {
    render(<PasswordPolicy />);
    
    const minLengthInput = screen.getByTestId('min-length-input');
    fireEvent.change(minLengthInput, { target: { value: '10' } });
    
    const input = screen.getByTestId('password-input');
    fireEvent.change(input, { target: { value: 'Test123!' } });
    
    // La contraseña tiene 8 caracteres pero el mínimo ahora es 10
    expect(screen.getByTestId('requirement-length')).toHaveClass('text-red-600');
    expect(screen.getByText('Minimum 10 characters')).toBeInTheDocument();
  });
});