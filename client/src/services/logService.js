import * as Sentry from "@sentry/react";

let isInitialized = false;

export const initializeSentry = () => {
  if (isInitialized || process.env.NODE_ENV === 'test') return;

  try {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN || "https://efb0f41d69fccbd9e372b401e5a9d8e2@o4507499146444800.ingest.us.sentry.io/4507499148148736",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
      tracePropagationTargets: ["localhost", /^https:\/\/geowordle\.com\/api/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      enabled: process.env.NODE_ENV === 'production',
    });
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

export const logError = (message, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
    return;
  }

  if (isInitialized) {
    Sentry.captureException(error, {
      extra: { message },
    });
  }
};

export const logMessage = (message, level = 'info') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}]`, message);
    return;
  }

  if (isInitialized) {
    Sentry.captureMessage(message, level);
  }
};
