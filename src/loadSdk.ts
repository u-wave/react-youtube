/// <reference lib="youtube" />

function loadSdk() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.youtube.com/iframe_api';
    script.onload = () => {
      script.onerror = null;
      script.onload = null;
      YT.ready(resolve);
    };
    script.onerror = () => {
      script.onerror = null;
      script.onload = null;
      reject(new Error('Could not load YouTube SDK'));
    };

    document.head.appendChild(script);
  });
}

let sdk = null;
export default function getSdk(callback: () => void) {
  if (typeof YT === 'object' && typeof YT.ready === 'function') {
    // A YouTube SDK is already loaded, so reuse that
    YT.ready(callback);
    return;
  }

  sdk ??= loadSdk();
  sdk.then(callback);
}
