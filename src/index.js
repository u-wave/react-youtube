import * as React from 'react';
import PropTypes from 'prop-types';
import eventNames from './eventNames';
import loadSdk from './loadSdk';

class YouTube extends React.Component {
  constructor(props) {
    super(props);

    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.refContainer = this.refContainer.bind(this);
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const changes = Object.keys(this.props).filter(name => this.props[name] !== prevProps[name]);

    this.updateProps(changes);
  }

  componentWillUnmount() {
    if (this.playerInstance) {
      this.playerInstance.destroy();
    }
  }

  onPlayerReady(event) {
    const {
      volume,
      muted,
      suggestedQuality,
      playbackRate,
    } = this.props;

    if (typeof volume !== 'undefined') {
      event.target.setVolume(volume * 100);
    }
    if (typeof muted !== 'undefined') {
      if (muted) {
        event.target.mute();
      } else {
        event.target.unMute();
      }
    }
    if (typeof suggestedQuality !== 'undefined') {
      event.target.setPlaybackQuality(suggestedQuality);
    }
    if (typeof playbackRate !== 'undefined') {
      event.target.setPlaybackRate(playbackRate);
    }

    this.resolvePlayer(event.target);
  }

  onPlayerStateChange(event) {
    const {
      onCued,
      onBuffering,
      onPause,
      onPlaying,
      onEnd,
    } = this.props;

    const State = YT.PlayerState; // eslint-disable-line no-undef
    switch (event.data) {
      case State.CUED:
        onCued(event);
        break;
      case State.BUFFERING:
        onBuffering(event);
        break;
      case State.PAUSED:
        onPause(event);
        break;
      case State.PLAYING:
        onPlaying(event);
        break;
      case State.ENDED:
        onEnd(event);
        break;
      default:
        // Nothing
    }
  }

  /**
   * @private
   */
  getPlayerParameters() {
    /* eslint-disable react/destructuring-assignment */
    return {
      autoplay: this.props.autoplay,
      cc_load_policy: this.props.showCaptions ? 1 : 0,
      controls: this.props.controls ? 1 : 0,
      disablekb: this.props.disableKeyboard ? 1 : 0,
      fs: this.props.allowFullscreen ? 1 : 0,
      hl: this.props.lang,
      iv_load_policy: this.props.annotations ? 1 : 3,
      start: this.props.startSeconds,
      end: this.props.endSeconds,
      modestbranding: this.props.modestBranding ? 1 : 0,
      playsinline: this.props.playsInline ? 1 : 0,
      rel: this.props.showRelatedVideos ? 1 : 0,
      showinfo: this.props.showInfo ? 1 : 0,
    };
    /* eslint-enable react/destructuring-assignment */
  }

  /**
   * @private
   */
  getInitialOptions() {
    /* eslint-disable react/destructuring-assignment */
    return {
      videoId: this.props.video,
      width: this.props.width,
      height: this.props.height,
      playerVars: this.getPlayerParameters(),
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange,
      },
    };
    /* eslint-enable react/destructuring-assignment */
  }

  /**
   * @private
   */
  updateProps(propNames) {
    this.player.then((player) => {
      propNames.forEach((name) => {
        // eslint-disable-next-line react/destructuring-assignment
        const value = this.props[name];
        switch (name) {
          case 'muted':
            if (value) {
              player.mute();
            } else {
              player.unMute();
            }
            break;
          case 'suggestedQuality':
            player.setPlaybackQuality(value);
            break;
          case 'volume':
            player.setVolume(value * 100);
            break;
          case 'paused':
            if (value && player.getPlayerState() !== 2) {
              player.pauseVideo();
            } else if (!value && player.getPlayerState() === 2) {
              player.playVideo();
            }
            break;
          case 'id':
          case 'className':
          case 'width':
          case 'height':
            player.getIframe()[name] = value; // eslint-disable-line no-param-reassign
            break;
          case 'video':
            if (!value) {
              player.stopVideo();
            } else {
              const { startSeconds, endSeconds, autoplay } = this.props;
              const opts = {
                videoId: value,
                startSeconds: startSeconds || 0,
                endSeconds,
              };
              if (autoplay) {
                player.loadVideoById(opts);
              } else {
                player.cueVideoById(opts);
              }
            }
            break;
          default:
            // Nothing
        }
      });
    });
  }

  /**
   * @private
   */
  createPlayer() {
    const { volume } = this.props;

    this.player = loadSdk().then(YT => new Promise((resolve) => {
      this.resolvePlayer = resolve;

      const player = new YT.Player(this.container, this.getInitialOptions());
      // Store the instance directly so we can destroy it sync in
      // `componentWillUnmount`.
      this.playerInstance = player;

      eventNames.forEach((name) => {
        player.addEventListener(name, (event) => {
          // eslint-disable-next-line react/destructuring-assignment
          const handler = this.props[name];
          if (handler) {
            handler(event);
          }
        });
      });
    }));

    if (typeof volume === 'number') {
      this.updateProps(['volume']);
    }
  }

  /**
   * @private
   */
  refContainer(container) {
    this.container = container;
  }

  render() {
    const { id, className } = this.props;

    return (
      <div
        id={id}
        className={className}
        ref={this.refContainer}
      />
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  YouTube.propTypes = {
    /**
     * An 11-character string representing a YouTube video ID..
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
     * Whether to show video information (uploader, title, etc) before the video
     * starts.
     *
     * https://developers.google.com/youtube/player_parameters#showinfo
     */
    showInfo: PropTypes.bool,

    /**
     * The playback volume, **as a number between 0 and 1**.
     */
    volume: PropTypes.number,

    /**
     * Whether the video's sound should be muted.
     */
    muted: PropTypes.bool,

    /**
     * The suggested playback quality.
     *
     * https://developers.google.com/youtube/iframe_api_reference#Playback_quality
     */
    suggestedQuality: PropTypes.string,
    /**
     * Playback speed.
     *
     * https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
     */
    playbackRate: PropTypes.number,

    // Events
    /* eslint-disable react/no-unused-prop-types */

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

    /* eslint-enable react/no-unused-prop-types */
  };
}

YouTube.defaultProps = {
  autoplay: false,
  showCaptions: false,
  controls: true,
  disableKeyboard: false,
  allowFullscreen: true,
  annotations: true,
  modestBranding: false,
  playsInline: false,
  showRelatedVideos: true,
  showInfo: true,
  onCued: () => {},
  onBuffering: () => {},
  onPlaying: () => {},
  onPause: () => {},
  onEnd: () => {},
};

export default YouTube;
