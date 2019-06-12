/// <reference types="youtube" />
import * as React from 'react'

export interface YouTubeProps {
  /**
   * An 11-character string representing a YouTube video ID..
   */
  video?: string;
  /**
   * DOM ID for the player element.
   */
  id?: string;
  /**
   * CSS className for the player element.
   */
  className?: string;
  /**
   * Width of the player element.
   */
  width?: number | string;
  /**
   * Height of the player element.
   */
  height?: number | string;

  /**
   * Pause the video.
   */
  paused?: boolean;

  // Player parameters

  /**
   * Whether the video should start playing automatically.
   *
   * https://developers.google.com/youtube/player_parameters#autoplay
   */
  autoplay?: boolean;
  /**
   * Whether to show captions below the video.
   *
   * https://developers.google.com/youtube/player_parameters#cc_load_policy
   */
  showCaptions?: boolean;
  /**
   * Whether to show video controls.
   *
   * https://developers.google.com/youtube/player_parameters#controls
   */
  controls?: boolean;
  /**
   * Ignore keyboard controls.
   *
   * https://developers.google.com/youtube/player_parameters#disablekb
   */
  disableKeyboard?: boolean;
  /**
   * Whether to display the fullscreen button.
   *
   * https://developers.google.com/youtube/player_parameters#fs
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
   * Remove most YouTube logos from the player.
   *
   * https://developers.google.com/youtube/player_parameters#modestbranding
   */
  modestBranding?: boolean;
  /**
   * Whether to play the video inline on iOS, instead of fullscreen.
   *
   * https://developers.google.com/youtube/player_parameters#playsinline
   */
  playsInline?: boolean;
  /**
   * Whether to show related videos after the video is over.
   *
   * https://developers.google.com/youtube/player_parameters#rel
   */
  showRelatedVideos?: boolean;
  /**
   * Whether to show video information (uploader, title, etc) before the video
   * starts.
   *
   * https://developers.google.com/youtube/player_parameters#showinfo
   */
  showInfo?: boolean;

  /**
   * The playback volume, **as a number between 0 and 1**.
   */
  volume?: number;

  /**
   * Whether the video's sound should be muted.
   */
  muted?: boolean;

  /**
   * The suggested playback quality.
   *
   * https://developers.google.com/youtube/iframe_api_reference#Playback_quality
   */
  suggestedQuality?: string;
  /**
   * Playback speed.
   *
   * https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
   */
  playbackRate?: number;

  // Events

  /**
   * Sent when the YouTube player API has loaded.
   */
  onReady?: YT.PlayerEventHandler<YT.PlayerEvent>;
  /**
   * Sent when the player triggers an error.
   */
  onError?: YT.PlayerEventHandler<YT.OnErrorEvent>;
  /**
   * Sent when the video is cued and ready to play.
   */
  onCued?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /**
   * Sent when the video is buffering.
   */
  onBuffering?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /**
   * Sent when playback has been started or resumed.
   */
  onPlaying?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /**
   * Sent when playback has been paused.
   */
  onPause?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  /**
   * Sent when playback has stopped.
   */
  onEnd?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  onStateChange?: YT.PlayerEventHandler<YT.OnStateChangeEvent>;
  onPlaybackRateChange?: YT.PlayerEventHandler<YT.OnPlaybackRateChangeEvent>;
  onPlaybackQualityChange?: YT.PlayerEventHandler<YT.OnPlaybackQualityChangeEvent>;
}

export default class YouTube extends React.Component<YouTubeProps> {}
