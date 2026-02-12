import React from 'react';
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

export interface YouTubeOptions {
  /** An 11-character string representing a YouTube video ID. */
  video?: string | null;
  /** Width of the player element. */
  width?: number | string;
  /** Height of the player element. */
  height?: number | string;

  /**
   * YouTube host to use: 'https://www.youtube.com' or 'https://www.youtube-nocookie.com'.
   *
   * @default 'https://www.youtube.com'
   */
  host?: string;

  /** The YouTube API will usually default this value correctly. It is exposed for completeness. */
  origin?: string;

  /** Pause the video. */
  paused?: boolean;

  // Player parameters

  /**
   * Whether the video should start playing automatically.
   *
   * https://developers.google.com/youtube/player_parameters#autoplay
   *
   * @default false
   */
  autoplay?: boolean;
  /**
   * Whether to show captions below the video.
   *
   * https://developers.google.com/youtube/player_parameters#cc_load_policy
   *
   * @default false
   */
  showCaptions?: boolean;
  /**
   * Whether to show video controls.
   *
   * https://developers.google.com/youtube/player_parameters#controls
   *
   * @default true
   */
  controls?: boolean;
  /**
   * Ignore keyboard controls.
   *
   * https://developers.google.com/youtube/player_parameters#disablekb
   *
   * @default false
   */
  disableKeyboard?: boolean;
  /**
   * Whether to display the fullscreen button.
   *
   * https://developers.google.com/youtube/player_parameters#fs
   *
   * @default true
   */
  allowFullscreen?: boolean;
  /**
   * The player's interface language. The parameter value is an ISO 639-1
   * two-letter language code or a fully specified locale.
   *
   * https://developers.google.com/youtube/player_parameters#hl
   */
  lang?: string;
  /**
   * Whether to show annotations on top of the video.
   *
   * https://developers.google.com/youtube/player_parameters#iv_load_policy
   *
   * @default true
   */
  annotations?: boolean;
  /**
   * Time in seconds at which to start playing the video.
   *
   * https://developers.google.com/youtube/player_parameters#start
   */
  startSeconds?: number;
  /**
   * Time in seconds at which to stop playing the video.
   *
   * https://developers.google.com/youtube/player_parameters#end
   */
  endSeconds?: number;
  /**
   * Whether to play the video inline on iOS, instead of fullscreen.
   *
   * https://developers.google.com/youtube/player_parameters#playsinline
   *
   * @default false
   */
  playsInline?: boolean;
  /**
   * Whether to show related videos from other channels after the video is over.
   *
   * When `false`, only related videos from the same channel as the previous video are shown.
   *
   * https://developers.google.com/youtube/player_parameters#rel
   *
   * @default true
   */
  showRelatedVideos?: boolean;

  /** The playback volume, **as a number between 0 and 1**. */
  volume?: number;

  /** Whether the video's sound should be muted. */
  muted?: boolean;

  /**
   * Playback speed.
   *
   * https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
   */
  playbackRate?: number;

  /** Sent when the YouTube player API has loaded. */
  onReady?: YT.PlayerEventHandler<YT.PlayerEvent>;
  /** Sent when the player triggers an error. */
  onError?: YT.PlayerEventHandler<YT.OnErrorEvent>;
  /** Sent when the video is cued and ready to play. */
  onCued?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /** Sent when the video is buffering. */
  onBuffering?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /** Sent when playback has been started or resumed. */
  onPlaying?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /** Sent when playback has been paused. */
  onPause?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /** Sent when playback has stopped. */
  onEnd?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  onStateChange?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  onPlaybackRateChange?: YT.PlayerEventHandler<YT.OnPlaybackRateChangeEvent>;
  onPlaybackQualityChange?: YT.PlayerEventHandler<YT.OnPlaybackQualityChangeEvent>;
}

export interface YouTubeProps extends YouTubeOptions {
  /**
   * DOM ID for the player element.
   */
  id?: string;
  /**
   * CSS className for the player element.
   */
  className?: string;
  /**
  * Inline style for player element.
  */
  style?: React.CSSProperties;
}

/**
 * Attach an event listener to a YouTube player.
 */
function useEventHandler<K extends keyof YT.Events>(
  player: YT.Player | null,
  event: K,
  handler: YT.Events[K],
) {
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

function buildPlayerVars({
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
  playsInline = false,
  showRelatedVideos = true,
  origin = typeof window.location === 'object' ? window.location.origin : undefined,
}: YouTubeOptions): YT.PlayerVars {
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
    playsinline: playsInline ? 1 : 0,
    rel: showRelatedVideos ? 1 : 0,
    mute: muted ? 1 : 0,
    origin,
  };
}

/**
 * Create a YouTube player at `container`. `container` must be a ref object.
 *
 * Returns the `YT.Player` object, or `null` until the player is ready.
 */
function useYouTube(
  container: React.RefObject<HTMLElement | null | undefined>,
  options: YouTubeOptions,
) {
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
  const [player, setPlayer] = useState<YT.Player | null>(null);

  function createPlayer() {
    if (!container.current) {
      throw new Error('react-youtube: container ref missing. The container must *always* be mounted when calling `useYouTube`');
    }

    return new YT.Player(container.current, {
      videoId: video ?? undefined,
      width,
      height,
      host: options.host,
      playerVars: buildPlayerVars(options),
      events: {
        onReady: (event) => {
          setPlayer(event.target);
        },
      },
    });
  }

  const firstRenderRef = useRef(true);

  // Stick the player initialisation in a ref so it has the most recent props values
  // when it gets instantiated.
  const createPlayerRef = useRef<() => YT.Player>(createPlayer);
  useEffect(() => {
    createPlayerRef.current = createPlayer;
  });

  useLayoutEffect(() => {
    let instance: YT.Player | null = null;
    let cancelled = false;

    loadSdk(() => {
      if (!cancelled) {
        // `createPlayer` is always initialised during the first render
        instance = createPlayerRef.current!();
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

  const handlePlayerStateChange = useCallback((event: YT.OnStateChangeEvent) => {
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
    player?.setSize(width as number, height as number);
  }, [player, width, height]);

  useEffect(() => {
    if (muted) {
      player?.mute();
    } else {
      player?.unMute();
    }
  }, [player, muted]);

  useEffect(() => {
    if (playbackRate != null) {
      player?.setPlaybackRate(playbackRate);
    }
  }, [player, playbackRate]);

  useEffect(() => {
    if (volume != null) {
      player?.setVolume(volume * 100);
    }
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
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
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

/**
 * Renders an iframe and attaches the YouTube player to it.
 *
 * It supports all the same options as the `useYouTube` hook, plus a few to configure the iframe.
 * If you need to do more with the iframe than this component provides, consider using the
 * `useYouTube` hook directly.
 */
function YouTube({
  id,
  className,
  style,
  ...options
}: YouTubeProps) {
  const container = useRef<HTMLDivElement>(null);
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

export { useYouTube };
export default YouTube;
