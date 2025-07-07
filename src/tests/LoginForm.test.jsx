import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  it('renders form inputs and submit button', () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation messages on empty submit', async () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation for invalid email and password format', async () => {
    render(<LoginForm onSuccess={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/email address/i), 'invalid-email');
    await userEvent.type(screen.getByLabelText(/password/i), '123');

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is not valid/i)).toBeInTheDocument();
      expect(screen.getByText(/password should have more than 4 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password should have at least one lower case letter/i)).toBeInTheDocument();
    });
  });

    it('shows validation if password has no number', async () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Abcdef');

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/password should have at least one number/i)).toBeInTheDocument();
    });
  });

  it('shows validation if password has no lowercase letter', async () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'ABC123');

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/password should have at least one lower case letter/i)).toBeInTheDocument();
    });
  });

  it('shows validation if password is too short', async () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'a1');

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/password should have more than 4 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'abc1X');

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'abc1X',
      });
    });
  });
});