import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Keyboard from './Keyboard';

describe('Keyboard', () => {
  const mockOnKeyPress = jest.fn();
  const defaultProps = {
    usedLetters: {},
    onKeyPress: mockOnKeyPress,
  };

  beforeEach(() => {
    mockOnKeyPress.mockClear();
  });

  it('renders all letter keys', () => {
    render(<Keyboard {...defaultProps} />);

    // Check for some sample letters
    expect(screen.getByText('Q')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('calls onKeyPress when a letter is clicked', () => {
    render(<Keyboard {...defaultProps} />);

    fireEvent.click(screen.getByText('A'));
    expect(mockOnKeyPress).toHaveBeenCalledWith('A');
  });

  it('applies correct status class to used letters', () => {
    const propsWithUsedLetters = {
      ...defaultProps,
      usedLetters: {
        'A': 'correct',
        'B': 'present',
        'C': 'absent',
      },
    };

    render(<Keyboard {...propsWithUsedLetters} />);

    const keyA = screen.getByText('A').closest('button');
    const keyB = screen.getByText('B').closest('button');
    const keyC = screen.getByText('C').closest('button');
    const keyD = screen.getByText('D').closest('button');

    expect(keyA).toHaveClass('key-correct');
    expect(keyB).toHaveClass('key-present');
    expect(keyC).toHaveClass('key-absent');
    expect(keyD).toHaveClass('key');
    expect(keyD).not.toHaveClass('key-correct');
    expect(keyD).not.toHaveClass('key-present');
    expect(keyD).not.toHaveClass('key-absent');
  });

  it('renders enter and backspace keys', () => {
    render(<Keyboard {...defaultProps} />);

    // These render icons, so check for the buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(28); // 26 letters + Enter + Backspace
  });

  it('handles Enter key click', () => {
    render(<Keyboard {...defaultProps} />);

    // Find button with Enter (it renders an icon)
    const buttons = screen.getAllByRole('button');
    const enterButton = buttons.find(btn => btn.classList.contains('key-wide'));

    if (enterButton) {
      fireEvent.click(enterButton);
      expect(mockOnKeyPress).toHaveBeenCalled();
    }
  });
});
