import * as Sentry from "@sentry/react";

export const initializeSentry = () => {
  Sentry.init({
    dsn: "https://efb0f41d69fccbd9e372b401e5a9d8e2@o4507499146444800.ingest.us.sentry.io/4507499148148736",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

export const logError = (message, error) => {
  console.error(message, error);
  Sentry.captureException(error, {
    extra: {
      message: message,
    },
  });
};
