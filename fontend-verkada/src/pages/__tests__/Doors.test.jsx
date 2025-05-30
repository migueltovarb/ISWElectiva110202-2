// src/pages/__tests__/Doors.test.jsx
import { render, screen } from '@testing-library/react';
import Doors from '../Doors';
import { describe, it, expect } from 'vitest';

describe('Doors page', () => {
  it('renders heading', () => {
    render(<Doors />);
    expect(screen.getByText(/Registrar Puerta/i)).toBeInTheDocument();
  });
});
