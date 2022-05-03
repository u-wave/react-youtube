// @ts-check
/* global YT */
import React from 'react';
import PropTypes from 'prop-types';
import loadSdk from './loadSdk';

const {
  useCallback,
  useEffect,
  useRef,
  useState,
} = React;
const useLayoutEffect = typeof document !== 'undefined' ? React.useLayoutEffect : useEffect;

// Player state numbers are documented to be constants, so we can inline them.
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const CUED = 5;

/**
 * Attach an event listener to a YouTube player.
 *
 * @template {keyof YT.Events} K
 * @param {YT.Player|null} player
 * @param {K} event
 * @param {YT.Events[K]} handler
 */
function useEventHandler(player, event, handler) {
  useEffect(() => {
    if (handler && player) {
      player.addEventListener(event, handler);
    }
    return () => {
      // If the iframe was already deleted, removing event
      // listeners is unnecessary, and can actually cause a crash.
      if (handler && player && player.getIframe()) {
        player.removeEventListener(event, handler);
      }
    };
  }, [player, event, handler]);
}

/**
 * @param {import('../index').YouTubeOptions} options
 * @return {YT.PlayerVars}
 */
function getPlayerVars({
  startSeconds,
  endSeconds,
  lang,
  muted = false,
  autoplay = false,
  showCaptions = false,
  controls = true,
  disableKeyboard = false,
  allowFullscreen = true,
  annotations = true,
  modestBranding = false,
  playsInline = false,
  showRelatedVideos = true,
}) {
  return {
    autoplay: autoplay ? 1 : 0,
    cc_load_policy: showCaptions ? 1 : 0,
    controls: controls ? 1 : 0,
    disablekb: disableKeyboard ? 1 : 0,
    fs: allowFullscreen ? 1 : 0,
    hl: lang,
    iv_load_policy: annotations ? 1 : 3,
    start: startSeconds,
    end: endSeconds,
    modestbranding: modestBranding ? 1 : 0,
    playsinline: playsInline ? 1 : 0,
    rel: showRelatedVideos ? 1 : 0,
    mute: muted ? 1 : 0,
  };
}

/**
 * @param {React.RefObject<HTMLElement>} container
 * @param {import('../index').YouTubeOptions} options
 */
function useYouTube(container, options) {
  const {
    video,
    startSeconds,
    endSeconds,
    width,
    height,
    paused,
    muted,
    volume,
    playbackRate,
    autoplay = false,
    onReady,
    onError,
    onStateChange,
    onPlaybackQualityChange,
    onPlaybackRateChange,
    onCued = () => {},
    onBuffering = () => {},
    onPlaying = () => {},
    onPause = () => {},
    onEnd = () => {},
  } = options;

  // Storing the player in the very first hook makes it easier to
  // find in React DevTools :)
  const [player, setPlayer] = useState(/** @type {YT.Player | null} */ (null));
  /** @type {React.MutableRefObject<() => YT.Player>} */
  const createPlayer = useRef(null);
  const firstRender = useRef(true);

  // Stick the player initialisation in a ref so it has the most recent props values
  // when it gets instantiated.
  if (!player) {
    createPlayer.current = () => new YT.Player(container.current, {
      videoId: video,
      width,
      height,
      playerVars: getPlayerVars(options),
      events: {
        onReady: (event) => {
          setPlayer(event.target);
        },
      },
    });
  }

  useLayoutEffect(() => {
    /** @type {YT.Player|null} */
    let instance = null;
    let cancelled = false;

    loadSdk(() => {
      if (!cancelled) {
        instance = createPlayer.current();
      }
    });

    return () => {
      cancelled = true;
      // Destroying the player here means that some other hooks cannot access its methods anymore,
      // so they do need to be careful in their unsubscribe effects.
      // There isn't really a way around this aside from manually implementing parts of the
      // `destroy()` method.
      // It's tempting to just remove the iframe here just in time for React to move in,
      // but we must use `.destroy()` to avoid memory leaks, since the YouTube SDK holds on
      // to references to player objects globally.
      instance?.destroy();
    };
  }, []);

  const handlePlayerStateChange = useCallback((event) => {
    switch (event.data) {
      case CUED:
        onCued(event);
        break;
      case BUFFERING:
        onBuffering(event);
        break;
      case PAUSED:
        onPause(event);
        break;
      case PLAYING:
        onPlaying(event);
        break;
      case ENDED:
        onEnd(event);
        break;
      default:
        // Nothing
    }
  }, [onCued, onBuffering, onPause, onPlaying, onEnd]);

  useEventHandler(player, 'onStateChange', handlePlayerStateChange);
  useEventHandler(player, 'onReady', onReady);
  useEventHandler(player, 'onStateChange', onStateChange);
  useEventHandler(player, 'onPlaybackQualityChange', onPlaybackQualityChange);
  useEventHandler(player, 'onPlaybackRateChange', onPlaybackRateChange);
  useEventHandler(player, 'onError', onError);

  useEffect(() => {
    // We pretend to be a bit smarter than the typescript definitions here, since
    // YouTube teeeechnically supports strings like '100%' too.
    player?.setSize(/** @type {number} */ (width), /** @type {number} */ (height));
  }, [player, width, height]);

  useEffect(() => {
    if (muted) {
      player?.mute();
    } else {
      player?.unMute();
    }
  }, [player, muted]);

  useEffect(() => {
    player?.setPlaybackRate(playbackRate);
  }, [player, playbackRate]);

  useEffect(() => {
    player?.setVolume(volume * 100);
  }, [player, volume]);

  useEffect(() => {
    if (!player) {
      return;
    }
    if (paused && player.getPlayerState() !== 2) {
      player.pauseVideo();
    } else if (!paused && player.getPlayerState() === 2) {
      player.playVideo();
    }
  }, [player, paused]);

  useEffect(() => {
    if (!player) {
      return;
    }

    // Avoid calling a load() function when the player has just initialised,
    // since it will already be up to date at that stage.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!video) {
      player.stopVideo();
    } else {
      const opts = {
        videoId: video,
        startSeconds: startSeconds || 0,
        endSeconds,
      };
      if (autoplay) {
        player.loadVideoById(opts);
      } else {
        player.cueVideoById(opts);
      }
    }
  }, [player, video]);

  return player;
}

/** @param {import('../index').YouTubeProps} props */
function YouTube({
  id,
  className,
  style,
  ...options
}) {
  /** @type {React.RefObject<HTMLDivElement>} */
  const container = useRef(null);
  useYouTube(container, options);

  return (
    <div
      id={id}
      className={className}
      style={style}
      ref={container}
    />
  );
}

if (process.env.NODE_ENV !== 'production') {
  YouTube.propTypes = {
    /**
     * An 11-character string representing a YouTube video ID.
     */
    video: PropTypes.string,
    /**
     * DOM ID for the player element.
     */
    id: PropTypes.string,
    /**
     * CSS className for the player element.
     */
    className: PropTypes.string,
    /**
     * Inline style for the player element.
     */
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    /**
     * Width of the player element.
     */
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    /**
     * Height of the player element.
     */
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /**
     * Pause the video.
     */
    paused: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

    // Player parameters

    /**
     * Whether the video should start playing automatically.
     *
     * https://developers.google.com/youtube/player_parameters#autoplay
     */
    autoplay: PropTypes.bool,
    /**
     * Whether to show captions below the video.
     *
     * https://developers.google.com/youtube/player_parameters#cc_load_policy
     */
    showCaptions: PropTypes.bool,
    /**
     * Whether to show video controls.
     *
     * https://developers.google.com/youtube/player_parameters#controls
     */
    controls: PropTypes.bool,
    /**
     * Ignore keyboard controls.
     *
     * https://developers.google.com/youtube/player_parameters#disablekb
     */
    disableKeyboard: PropTypes.bool,
    /**
     * Whether to display the fullscreen button.
     *
     * https://developers.google.com/youtube/player_parameters#fs
     */
    allowFullscreen: PropTypes.bool,
    /**
     * The player's interface language. The parameter value is an ISO 639-1
     * two-letter language code or a fully specified locale.
     *
     * https://developers.google.com/youtube/player_parameters#hl
     */
    lang: PropTypes.string,
    /**
     * Whether to show annotations on top of the video.
     *
     * https://developers.google.com/youtube/player_parameters#iv_load_policy
     */
    annotations: PropTypes.bool,
    /**
     * Time in seconds at which to start playing the video.
     *
     * https://developers.google.com/youtube/player_parameters#start
     */
    startSeconds: PropTypes.number,
    /**
     * Time in seconds at which to stop playing the video.
     *
     * https://developers.google.com/youtube/player_parameters#end
     */
    endSeconds: PropTypes.number,
    /**
     * Remove most YouTube logos from the player.
     *
     * https://developers.google.com/youtube/player_parameters#modestbranding
     */
    modestBranding: PropTypes.bool,
    /**
     * Whether to play the video inline on iOS, instead of fullscreen.
     *
     * https://developers.google.com/youtube/player_parameters#playsinline
     */
    playsInline: PropTypes.bool,
    /**
     * Whether to show related videos after the video is over.
     *
     * https://developers.google.com/youtube/player_parameters#rel
     */
    showRelatedVideos: PropTypes.bool,

    /**
     * The playback volume, **as a number between 0 and 1**.
     */
    volume: PropTypes.number,

    /**
     * Whether the video's sound should be muted.
     */
    muted: PropTypes.bool,

    /**
     * Playback speed.
     *
     * https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
     */
    playbackRate: PropTypes.number,

    // Events

    /**
     * Sent when the YouTube player API has loaded.
     */
    onReady: PropTypes.func,
    /**
     * Sent when the player triggers an error.
     */
    onError: PropTypes.func,
    /**
     * Sent when the video is cued and ready to play.
     */
    onCued: PropTypes.func,
    /**
     * Sent when the video is buffering.
     */
    onBuffering: PropTypes.func,
    /**
     * Sent when playback has been started or resumed.
     */
    onPlaying: PropTypes.func,
    /**
     * Sent when playback has been paused.
     */
    onPause: PropTypes.func,
    /**
     * Sent when playback has stopped.
     */
    onEnd: PropTypes.func,
    onStateChange: PropTypes.func,
    onPlaybackRateChange: PropTypes.func,
    onPlaybackQualityChange: PropTypes.func,
  };
}

export { useYouTube };
export default YouTube;
