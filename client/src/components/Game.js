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
const IS_DEV = process.env.NODE_ENV === 'development';

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
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const invisibleInputRef = useRef(null);

  useEffect(() => {
    checkIfPlayedToday();
    if (!hasPlayedToday) {
      fetchDailyWord();
      loadStats();
    }
    
    const timer = setTimeout(() => {
      trackEvent('game_start', { 'event_category': 'Game', 'event_label': 'New Game Started' });
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasPlayedToday]);

  const checkIfPlayedToday = () => {
    if (IS_DEV) return; // Skip check in development mode
    const lastPlayedDate = localStorage.getItem('lastPlayedDate');
    const today = format(new Date(), 'yyyy-MM-dd');
    if (lastPlayedDate === today) {
      setHasPlayedToday(true);
    }
  };

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
      console.log('Invisible input focused'); // For debugging
    }
  };

  const handleGameOver = (won) => {
    setGameOver(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem('lastPlayedDate', today);
    if (won) {
      setToast({ message: 'Congratulations! You guessed it!', type: 'success' });
      confetti();
    } else {
      setToast({ message: `Game over. The word was ${answer}.`, type: 'error' });
    }
    const currentGuessIndex = guesses.findIndex(guess => guess === '');
    updateStats(won, currentGuessIndex === -1 ? MAX_GUESSES : currentGuessIndex);
  };

  const handleKeyPress = useCallback(async (key) => {
    if (gameOver || hasPlayedToday) return;

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
          handleGameOver(true);
        } else if (currentGuessIndex === MAX_GUESSES - 1) {
          handleGameOver(false);
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
  }, [answer, currentGuess, gameOver, guesses, usedLetters, hasPlayedToday]);

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
      const playLink = "https://geowordle.mananagarwal.in/"; // Update this with your actual URL
      const shareText = `GeoWordle ${date} ${guessCount}/${MAX_GUESSES}\n\n${emojiGrid}\n\nCan you beat my score? Play here: ${playLink}`;
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

  const getTileColor = (letter, index, answer, guess) => {
    if (answer[index] === letter) {
      return 'bg-green-500 border-green-500 text-white';
    } else if (answer.includes(letter)) {
      // Count occurrences of the letter in the answer and in the guess up to this index
      const answerCount = answer.split(letter).length - 1;
      const guessCount = guess.slice(0, index + 1).split(letter).length - 1;
      const correctPositions = guess.split('').filter((l, i) => l === letter && answer[i] === letter).length;
      
      if (guessCount <= answerCount - correctPositions) {
        return 'bg-yellow-500 border-yellow-500 text-white';
      }
    }
    return 'bg-gray-500 border-gray-500 text-white';
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (hasPlayedToday) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl mb-4">You've already played today!</h2>
        <p>Come back tomorrow for a new word.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center min-h-screen p-2 sm:p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <input
        ref={invisibleInputRef}
        type="text"
        className="opacity-0 absolute"
        onFocus={() => console.log('Invisible input focused')}
      />
      <header className="w-full max-w-lg flex justify-between items-center mb-4 sm:mb-8">
        <div className="flex items-center">
          <button onClick={() => setShowRules(true)} className="p-1 sm:p-2"><Info size={20} /></button>
          <button onClick={() => setShowHints(true)} className="p-1 sm:p-2 ml-2"><HelpCircle size={20} /></button>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold flex items-center">
          <Globe className="mr-1 sm:mr-2" size={24} /> GeoWordle
        </h1>
        <div className="flex items-center">
          <button onClick={() => setDarkMode(!darkMode)} className="p-1 sm:p-2 mr-2">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setShowStats(true)} className="p-1 sm:p-2"><BarChart size={20} /></button>
        </div>
      </header>

      <div 
        className="grid gap-1 mb-4 sm:mb-8" 
        style={{ gridTemplateRows: `repeat(${MAX_GUESSES}, 1fr)` }}
        onClick={focusInvisibleInput}
      >
        {guesses.map((guess, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {Array(answer.length).fill().map((_, j) => (
              <motion.div 
                key={j} 
                className={`w-10 h-10 sm:w-14 sm:h-14 border-2 flex items-center justify-center font-bold text-lg sm:text-2xl
                  ${!guess[j] ? 'border-gray-300' : getTileColor(guess[j], j, answer, guess)}`}
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
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white text-sm sm:text-base`}
          disabled={!gameOver}
        >
          <Share2 className="mr-1 sm:mr-2" size={16} />
          Share
        </button>
      </div>

      <div className="mt-auto pt-4 text-sm text-center">
      Made with ❤️ by <a href="https://twitter.com/manan_0308" target="_blank" rel="noopener noreferrer" className="underline">Manan Agarwal</a>
    </div>

      <AnimatePresence>
        {toast.message && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
        )}
      </AnimatePresence>

      <HintSystem 
        show={showHints} 
        onClose={() => setShowHints(false)}
        hints={hints} 
        darkMode={darkMode} 
      />
      <RulesModal 
        show={showRules} 
        onClose={() => setShowRules(false)} 
        darkMode={darkMode} 
        wordLength={answer.length} 
      />
      <StatsModal 
        show={showStats} 
        onClose={() => setShowStats(false)} 
        stats={stats} 
        darkMode={darkMode} 
      />
      <WelcomeModal 
        show={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
    </div>
  );
};

export default Game;
