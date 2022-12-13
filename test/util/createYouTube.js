import { vi } from 'vitest';
import YouTube from '../../src/index.tsx';

vi.mock('../../src/loadSdk.ts', () => ({
  default(callback) {
    setImmediate(() => callback(globalThis.YT));
  },
}));

export default function createYouTube() {
  let isPaused = true;

  const iframeMock = {
    setId: vi.fn(),
    setClassName: vi.fn(),
    set className(className) {
      iframeMock.setClassName(className);
    },
  };

  const playerMock = {
    addEventListener: vi.fn((eventName, fn) => {
      if (eventName === 'onReady') fn({ target: playerMock });
    }),
    removeEventListener: vi.fn(),
    mute: vi.fn(),
    unMute: vi.fn(),
    setVolume: vi.fn(),
    setPlaybackRate: vi.fn(),
    loadVideoById: vi.fn(),
    cueVideoById: vi.fn(),
    playVideo: vi.fn(() => {
      isPaused = false;
    }),
    pauseVideo: vi.fn(() => {
      isPaused = true;
    }),
    stopVideo: vi.fn(),
    getPlayerState() {
      return isPaused ? 2 : 1;
    },
    getIframe() {
      return iframeMock;
    },
    setSize: vi.fn(),
  };

  const sdkMock = {
    Player: vi.fn((container, options) => {
      isPaused = !options.playerVars.autoplay;

      if (options.events && options.events.onReady) {
        setImmediate(() => {
          options.events.onReady({ target: playerMock });
        });
      }

      return playerMock;
    }),
  };

  globalThis.YT = sdkMock;

  return { YouTube, sdkMock, playerMock };
}
