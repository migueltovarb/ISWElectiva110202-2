// src/pages/__tests__/Users.test.jsx
import { render, screen } from '@testing-library/react';
import Users from '../Users';
import { describe, it, expect } from 'vitest';

describe('Users page', () => {
  it('renders heading', () => {
    render(<Users />);
    expect(screen.getByText(/Registrar Usuario/i)).toBeInTheDocument();
  });
});
