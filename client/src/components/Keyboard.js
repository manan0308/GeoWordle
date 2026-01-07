import React from 'react';
import { logError } from '../services/logService';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

const Keyboard = ({ usedLetters, onKeyPress, darkMode }) => {
  const getKeyStyle = (key) => {
    const isWide = key === 'Enter' || key === 'Backspace';

    // Base colors matching original Wordle
    let bgColor = darkMode ? '#818384' : '#d3d6da';
    let textColor = darkMode ? '#ffffff' : '#000000';

    if (usedLetters[key] === 'correct') {
      bgColor = '#6aaa64';
      textColor = '#ffffff';
    } else if (usedLetters[key] === 'present') {
      bgColor = '#c9b458';
      textColor = '#ffffff';
    } else if (usedLetters[key] === 'absent') {
      bgColor = darkMode ? '#3a3a3c' : '#787c7e';
      textColor = '#ffffff';
    }

    return {
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: '"Clear Sans", "Helvetica Neue", Arial, sans-serif',
      fontSize: '1.25em',
      fontWeight: 'bold',
      border: 0,
      padding: 0,
      margin: '0 6px 0 0',
      height: '58px',
      borderRadius: '4px',
      cursor: 'pointer',
      userSelect: 'none',
      flex: isWide ? 1.5 : 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.3)',
    };
  };

  const handleKeyPress = (key) => {
    try {
      onKeyPress(key);
    } catch (error) {
      logError('Error handling key press', error);
    }
  };

  const renderKey = (key) => {
    if (key === 'Backspace') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
          <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
        </svg>
      );
    }
    if (key === 'Enter') {
      return 'enter';
    }
    return key;
  };

  return (
    <div
      style={{
        height: '200px',
        margin: '0 8px',
        userSelect: 'none',
      }}
      role="group"
      aria-label="Keyboard"
    >
      {KEYBOARD_ROWS.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto 8px',
            touchAction: 'manipulation',
          }}
        >
          {/* Half-width spacer for middle row */}
          {i === 1 && <div style={{ flex: 0.5, maxWidth: '20px' }} />}

          {row.map((key) => (
            <button
              key={key}
              type="button"
              data-key={key === 'Enter' ? '↵' : key === 'Backspace' ? '←' : key.toLowerCase()}
              onClick={() => handleKeyPress(key)}
              style={getKeyStyle(key)}
              aria-label={key === 'Backspace' ? 'backspace' : key === 'Enter' ? 'enter' : `add ${key.toLowerCase()}`}
            >
              {renderKey(key)}
            </button>
          ))}

          {/* Half-width spacer for middle row */}
          {i === 1 && <div style={{ flex: 0.5, maxWidth: '20px' }} />}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
