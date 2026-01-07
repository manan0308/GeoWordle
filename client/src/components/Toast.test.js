import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the message', () => {
    render(<Toast message="Test message" type="success" onClose={mockOnClose} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies success class for success type', () => {
    const { container } = render(
      <Toast message="Success!" type="success" onClose={mockOnClose} />
    );
    expect(container.querySelector('.toast-success')).toBeInTheDocument();
  });

  it('applies error class for error type', () => {
    const { container } = render(
      <Toast message="Error!" type="error" onClose={mockOnClose} />
    );
    expect(container.querySelector('.toast-error')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Toast message="Test" type="success" onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after timeout', () => {
    render(<Toast message="Test" type="success" onClose={mockOnClose} />);

    // Fast-forward time
    jest.advanceTimersByTime(3000);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
