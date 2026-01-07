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

  it('applies correct styling to used letters', () => {
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

    // Check inline styles for correct colors
    expect(keyA).toHaveStyle({ backgroundColor: '#6aaa64' }); // correct - green
    expect(keyB).toHaveStyle({ backgroundColor: '#c9b458' }); // present - yellow
    expect(keyC).toHaveStyle({ backgroundColor: '#787c7e' }); // absent - gray
    expect(keyD).toHaveStyle({ backgroundColor: '#d3d6da' }); // unused - light gray
  });

  it('renders enter and backspace keys', () => {
    render(<Keyboard {...defaultProps} />);

    // These render icons, so check for the buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(28); // 26 letters + Enter + Backspace
  });

  it('handles Enter key click', () => {
    render(<Keyboard {...defaultProps} />);

    // Find Enter button by its aria-label
    const enterButton = screen.getByRole('button', { name: 'enter' });
    fireEvent.click(enterButton);
    expect(mockOnKeyPress).toHaveBeenCalledWith('Enter');
  });
});
