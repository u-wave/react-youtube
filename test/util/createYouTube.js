import { createSpy } from 'expect';
import proxyquire from 'proxyquire';

export default function createYouTube() {
  let isPaused = true;

  const iframeMock = {
    setWidth: createSpy(),
    setHeight: createSpy(),
    setId: createSpy(),
    setClassName: createSpy(),
    set width(width) {
      iframeMock.setWidth(width);
    },
    set height(height) {
      iframeMock.setHeight(height);
    },
    set id(id) {
      iframeMock.setId(id);
    },
    set className(className) {
      iframeMock.setClassName(className);
    },
  };

  const playerMock = {
    addEventListener: createSpy().andCall((eventName, fn) => {
      if (eventName === 'ready') fn();
    }),
    mute: createSpy(),
    unMute: createSpy(),
    setVolume: createSpy(),
    setPlaybackQuality: createSpy(),
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

  const YouTube = proxyquire('../../src/index.js', {
    './loadSdk': {
      default: () => Promise.resolve(sdkMock),
    },
  }).default;

  return { YouTube, sdkMock, playerMock };
}
