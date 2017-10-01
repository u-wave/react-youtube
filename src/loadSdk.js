/* global window */
import loadScript from 'load-script2';

function loadSdk() {
  return new Promise((resolve, reject) => {
    if (typeof window.YT === 'object' && typeof window.YT.ready === 'function') {
      // A YouTube SDK is already loaded, so reuse that
      window.YT.ready(() => {
        resolve(window.YT);
      });
      return;
    }

    loadScript('https://www.youtube.com/iframe_api', (err) => {
      if (err) {
        reject(err);
      } else {
        window.YT.ready(() => {
          resolve(window.YT);
        });
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
