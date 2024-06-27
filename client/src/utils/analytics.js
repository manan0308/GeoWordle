let isInitialized = false;

export const initGA = () => {
  if (!isInitialized) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-1LMY551VWY`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-1LMY551VWY');
      isInitialized = true;
    };
  }
};

export const trackEvent = (eventName, eventParams) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('GA Event:', eventName, eventParams);
  }
  if (window.gtag && isInitialized) {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('Google Analytics not initialized');
  }
};
