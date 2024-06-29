import React, { useState, useEffect, useCallback, useRef } from 'react';
import { trackEvent } from '../utils/analytics';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';
import { Globe, Moon, Sun, Share2, Info, BarChart, HelpCircle } from 'lucide-react';
import Keyboard from './Keyboard';
import StatsModal from './StatsModal';
import RulesModal from './RulesModal';
import HintSystem from './HintSystem';
import Toast from './Toast';
import WelcomeModal from './WelcomeModal';
import { logError } from '../services/logService';
import { validateWord } from '../utils/wordValidator';

const MAX_GUESSES = 6;

const Game = () => {
  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState({});
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [usedLetters, setUsedLetters] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0, maxStreak: 0, guesses: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const invisibleInputRef = useRef(null);

  useEffect(() => {
    fetchDailyWord();
    loadStats();
    
    const timer = setTimeout(() => {
      trackEvent('game_start', { 'event_category': 'Game', 'event_label': 'New Game Started' });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchDailyWord = async () => {
    try {
      const response = await axios.get('/api/daily-word');
      setAnswer(response.data.word.toUpperCase());
      setHints(response.data.hints);
      setGuesses(Array(MAX_GUESSES).fill(''));
      setIsLoading(false);
    } catch (error) {
      logError('Error fetching daily word', error);
      console.error('Error fetching daily word:', error);
      setToast({ message: 'Error loading game. Please try again.', type: 'error' });
      setIsLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const savedStats = JSON.parse(localStorage.getItem('geoWordleStats') || '{"played":0,"won":0,"streak":0,"maxStreak":0,"guesses":{}}');
      setStats(savedStats);
    } catch (error) {
      logError('Error loading stats', error);
      console.error('Error loading stats:', error);
      setToast({ message: 'Error loading stats. Using default values.', type: 'error' });
    }
  };

  const updateStats = (won, attempts) => {
    try {
      const newStats = {
        played: stats.played + 1,
        won: stats.won + (won ? 1 : 0),
        streak: won ? stats.streak + 1 : 0,
        maxStreak: won ? Math.max(stats.maxStreak, stats.streak + 1) : stats.maxStreak,
        guesses: {
          ...stats.guesses,
          [attempts]: (stats.guesses[attempts] || 0) + 1
        }
      };
      setStats(newStats);
      localStorage.setItem('geoWordleStats', JSON.stringify(newStats));
    } catch (error) {
      logError('Error updating stats', error);
      console.error('Error updating stats:', error);
      setToast({ message: 'Error updating stats.', type: 'error' });
    }
  };

  const focusInvisibleInput = () => {
    if (invisibleInputRef.current) {
      invisibleInputRef.current.focus();
    }
  };

  const handleKeyPress = useCallback(async (key) => {
    if (gameOver) return;

    try {
      if (key === 'Enter') {
        if (currentGuess.length !== answer.length) {
          setToast({ message: `Word must be ${answer.length} letters`, type: 'error' });
          return;
        }

        const isValid = await validateWord(currentGuess);
        if (!isValid) {
          setToast({ message: 'Not a valid word', type: 'error' });
          return;
        }

        const currentGuessIndex = guesses.findIndex(guess => guess === '');
        if (currentGuessIndex === -1) return;

        setGuesses(prev => {
          const newGuesses = [...prev];
          newGuesses[currentGuessIndex] = currentGuess;
          return newGuesses;
        });

        const newUsedLetters = { ...usedLetters };
        for (let i = 0; i < currentGuess.length; i++) {
          const letter = currentGuess[i];
          if (answer[i] === letter) {
            newUsedLetters[letter] = 'correct';
          } else if (answer.includes(letter) && newUsedLetters[letter] !== 'correct') {
            newUsedLetters[letter] = 'present';
          } else if (!newUsedLetters[letter]) {
            newUsedLetters[letter] = 'absent';
          }
        }
        setUsedLetters(newUsedLetters);

        if (currentGuess === answer) {
          setGameOver(true);
          setToast({ message: 'Congratulations! You guessed it!', type: 'success' });
          confetti();
          updateStats(true, currentGuessIndex + 1);
        } else if (currentGuessIndex === MAX_GUESSES - 1) {
          setGameOver(true);
          setToast({ message: `Game over. The word was ${answer}.`, type: 'error' });
          updateStats(false, MAX_GUESSES);
        }

        setCurrentGuess('');
      } else if (key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (currentGuess.length < answer.length && /^[A-Z]$/.test(key)) {
        setCurrentGuess(prev => prev + key);
      }
    } catch (error) {
      logError('Error handling key press', error);
      console.error('Error handling key press:', error);
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
    }
  }, [answer, currentGuess, gameOver, guesses, usedLetters]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === 'Enter') {
        handleKeyPress('Enter');
      } else if (event.key === 'Backspace') {
        handleKeyPress('Backspace');
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  const shareResults = () => {
    try {
      const date = format(new Date(), 'yyyy-MM-dd');
      const guessCount = guesses.filter(guess => guess !== '').length;
      const emojiGrid = guesses.map(guess => 
        guess.split('').map((letter, index) => 
          answer[index] === letter ? '🟩' : answer.includes(letter) ? '🟨' : '⬛'
        ).join('')
      ).join('\n');
      const shareText = `GeoWordle ${date} ${guessCount}/${MAX_GUESSES}\n\n${emojiGrid}`;
      navigator.clipboard.writeText(shareText).then(() => {
        setToast({ message: 'Results copied to clipboard!', type: 'success' });
      }, (err) => {
        throw err;
      });
    } catch (error) {
      logError('Error sharing results', error);
      console.error('Could not copy text: ', error);
      setToast({ message: 'Failed to copy results', type: 'error' });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <input
        ref={invisibleInputRef}
        type="text"
        className="opacity-0 absolute"
        onFocus={() => focusInvisibleInput()}
      />
      <header className="w-full max-w-lg flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button onClick={() => setShowRules(true)} className="p-2 mr-2"><Info size={24} /></button>
          <button onClick={() => setShowHints(true)} className="p-2"><HelpCircle size={24} /></button>
        </div>
        <h1 className="text-4xl font-bold flex items-center">
          <Globe className="mr-2" size={32} /> GeoWordle
        </h1>
        <div className="flex items-center">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 mr-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={() => setShowStats(true)} className="p-2"><BarChart size={24} /></button>
        </div>
      </header>

      <div 
        className="grid gap-1 mb-8" 
        style={{ gridTemplateRows: `repeat(${MAX_GUESSES}, 1fr)` }}
        onClick={() => focusInvisibleInput()}
      >
        {guesses.map((guess, i) => (
          <div key={i} className="flex gap-1">
            {Array(answer.length).fill().map((_, j) => (
              <motion.div 
                key={j} 
                className={`w-14 h-14 border-2 flex items-center justify-center font-bold text-2xl
                  ${!guess[j] ? 'border-gray-300' :
                    answer[j] === guess[j] ? 'bg-green-500 border-green-500 text-white' :
                    answer.includes(guess[j]) ? 'bg-yellow-500 border-yellow-500 text-white' :
                    'bg-gray-500 border-gray-500 text-white'}`}
                initial={guess[j] ? { rotateX: 0 } : false}
                animate={guess[j] ? { rotateX: 360 } : false}
                transition={{ duration: 0.5 }}
              >
                {guess[j] || (i === guesses.findIndex(g => g === '') && currentGuess[j]) || ''}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <Keyboard
        usedLetters={usedLetters}
        onKeyPress={handleKeyPress}
        darkMode={darkMode}
      />

      <div className="flex items-center mt-4 space-x-4">
        <button 
          onClick={shareResults} 
          className={`flex items-center px-4 py-2 rounded ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white`}
          disabled={!gameOver}
        >
          <Share2 className="mr-2" size={18} />
          Share
        </button>
      </div>

      <AnimatePresence>
        {toast.message && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
        )}
      </AnimatePresence>

      <HintSystem 
        show={showHints} 
        onClose={() => {
          setShowHints(false);
        }} 
        hints={hints} 
        darkMode={darkMode} 
      />
      <RulesModal show={showRules} onClose={() => setShowRules(false)} darkMode={darkMode} wordLength={answer.length} />
      <StatsModal show={showStats} onClose={() => setShowStats(false)} stats={stats} darkMode={darkMode} />
      <WelcomeModal show={showWelcome} onClose={() => setShowWelcome(false)} />
    </div>
  );
};

export default Game;
