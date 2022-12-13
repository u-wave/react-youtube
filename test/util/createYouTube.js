import { createSpy } from 'expect';
import proxyquire from 'proxyquire';

export default function createYouTube() {
  let isPaused = true;

  const iframeMock = {
    setId: createSpy(),
    setClassName: createSpy(),
    set className(className) {
      iframeMock.setClassName(className);
    },
  };

  const playerMock = {
    addEventListener: createSpy().andCall((eventName, fn) => {
      if (eventName === 'onReady') fn({ target: playerMock });
    }),
    removeEventListener: createSpy(),
    mute: createSpy(),
    unMute: createSpy(),
    setVolume: createSpy(),
    setPlaybackRate: createSpy(),
    loadVideoById: createSpy(),
    cueVideoById: createSpy(),
    playVideo: createSpy().andCall(() => {
      isPaused = false;
    }),
    pauseVideo: createSpy().andCall(() => {
      isPaused = true;
    }),
    stopVideo: createSpy(),
    getPlayerState() {
      return isPaused ? 2 : 1;
    },
    getIframe() {
      return iframeMock;
    },
    setSize: createSpy(),
  };

  const sdkMock = {
    Player: createSpy().andCall((container, options) => {
      isPaused = !options.playerVars.autoplay;

      if (options.events && options.events.onReady) {
        setImmediate(() => {
          options.events.onReady({ target: playerMock });
        });
      }

      return playerMock;
    }),
  };

  const YouTube = proxyquire('../../src/index.tsx', {
    './loadSdk': {
      default(callback) {
        global.YT = sdkMock;
        setImmediate(() => callback(sdkMock));
      },
    },
  }).default;

  return { YouTube, sdkMock, playerMock };
}
