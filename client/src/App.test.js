import React from 'react';
import { render } from '@testing-library/react';

// Set up matchMedia mock before importing App
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      word: 'PARIS',
      hints: {
        hint1: 'Located in Europe',
        hint2: 'Capital of France',
        hint3: 'Home to the Eiffel Tower'
      }
    }
  })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock Sentry
jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  browserTracingIntegration: jest.fn(),
  replayIntegration: jest.fn(),
}));

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn());

// Import App after all mocks
import App from './App';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
