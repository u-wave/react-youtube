/* global window */
import loadScript from 'load-script';

function loadSdk() {
  return new Promise((resolve, reject) => {
    if (typeof window.YT === 'object' && typeof window.YT.Player === 'function') {
      // A YouTube SDK is already loaded, so reuse that
      resolve(window.YT);
      return;
    }

    const onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (onYouTubeIframeAPIReady) {
        onYouTubeIframeAPIReady();
      }
      // Revert.
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

      resolve(window.YT);
    };

    loadScript('https://www.youtube.com/iframe_api', (err) => {
      if (err) {
        reject(err);
      }
    });
  });
}

let sdk = null;
export default function getSdk() {
  if (!sdk) {
    sdk = loadSdk();
  }
  return sdk;
}
