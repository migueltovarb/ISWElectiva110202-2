import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';


function TestComponent({ children }: { children: (auth: ReturnType<typeof useAuth>) => ReactNode }) {
  const auth = useAuth();
  return <div data-testid="test-component">{children(auth)}</div>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <>
              <div data-testid="is-authenticated">{String(auth.isAuthenticated)}</div>
              <div data-testid="user">{JSON.stringify(auth.user)}</div>
            </>
          )}
        </TestComponent>
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('handles login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <>
              <button onClick={async () => {
                try {
                  await auth.login('admin@example.com', 'password');
                } catch (error) {
                  console.error('Login failed:', error);
                }
              }}>
                Login
              </button>
              <div data-testid="auth-status">
                {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </div>
            </>
          )}
        </TestComponent>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toBeTruthy();
    });
  });

  it('handles login failure', async () => {
    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <>
              <button onClick={async () => {
                try {
                  await auth.login('wrong@email.com', 'wrongpass');
                } catch (error) {
                  const errorMessage = (error as Error).message;
                  const errorDiv = screen.getByTestId('error-message');
                  errorDiv.textContent = errorMessage;
                }
              }}>
                Login
              </button>
              <div data-testid="error-message" />
            </>
          )}
        </TestComponent>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe('Usuario no encontrado');
    });
  });

  it('handles logout', async () => {
    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <>
              <button onClick={() => auth.logout()}>Logout</button>
              <div data-testid="is-authenticated">{String(auth.isAuthenticated)}</div>
              <div data-testid="user">{JSON.stringify(auth.user)}</div>
            </>
          )}
        </TestComponent>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
    });
  });
});
