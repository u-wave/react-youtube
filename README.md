# react-dailymotion

Dailymotion player component for React.

[Install] - [Usage] - [Demo] - [Props]

## Install

```
npm install --save react-dailymotion
```

## Usage

[Demo] - [Demo source code]

```js
import Dailymotion from 'react-dailymotion';

<Dailymotion
  video="x2to0hs"
  uiTheme="light"
  autoplay
/>
```

## Props

| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| video | string |  | A string representing a video ID – of the form xID (e.g. xwr14q) for public-accessible videos or kID (e.g. kABCD1234) for private-accessible videos. |
| id | string |  | DOM ID for the player element. |
| className | string |  | CSS className for the player element. |
| width | union |  | Width of the player element. |
| height | union |  | Height of the player element. |
| paused | bool |  | Pause the video. |
| autoplay | bool |  | Starts the playback of the video automatically after the player loads. |
| controls | bool |  | Whether to display the player controls or not. This parameter only removes the control bar, but keeps the startscreen and the endscreen (useful on mobile devices where the video tag needs a direct user interaction to start the playback). |
| showEndScreen | bool |  | Whether to enable the end screen or not. |
| mute | bool |  | Whether to mute the video or not. |
| origin | string |  | The domain of the page hosting the Dailymotion player. You might want to specify origin for extra security. |
| quality | enum:<br>&nbsp;'240'<br>&nbsp;'380'<br>&nbsp;'480'<br>&nbsp;'720'<br>&nbsp;'1080'<br>&nbsp;'1440'<br>&nbsp;'2160'<br> |  | Specifies the _suggested_ playback quality for the video. |
| sharing | bool |  | Whether to display the sharing button or not. |
| start | number |  | Specifies the time (in seconds) from which the video should start playing. |
| subtitles | string |  | Specifies the selected subtitles language. |
| syndication | string |  | Passes your syndication key to the player. |
| uiHighlightColor | string |  | Change the default highlight colour used in the controls (hex value). See [the player customisation section](https://developer.dailymotion.com/player#player-customisation) in the Dailymotion docs for more on how this option is actually used. |
| uiShowLogo | bool |  | Whether to display the Dailymotion logo or not. |
| uiShowStartScreenInfo | bool |  | Whether to show video information (title and owner) on the start screen. |
| uiTheme | enum:<br>&nbsp;'light'<br>&nbsp;'dark'<br> | 'dark' | Choose the default base colour theme. See [the player customisation section](https://developer.dailymotion.com/player#player-customisation) in the Dailymotion docs for more on how this option is actually used. |
| volume | number |  | Sets the player's volume to the specified level, a number between 0 and 1. |
| onAdEnd | function |  | Sent when the player reaches the end of an Ad media resource. |
| onAdPause | function |  | Sent when an Ad playback pauses. |
| onAdPlay | function |  | Sent when an Ad playback starts. |
| onAdStart | function |  | Sent when the player starts to play an Ad media resource. |
| onAdTimeUpdate | function |  | Sent on each Ad's time update. |
| onApiReady | function |  | Sent when the player is ready to accept API commands. |
| onDurationChange | function |  | Sent when the duration of the video become available or change during playback. |
| onEnd | function |  | Sent when playback has stopped at the end of the media resources set (ads + content). |
| onError | function |  | Sent when the player triggers an error. |
| onFullscreenChange | function |  | Sent when the player enters or exits fullscreen. |
| onLoadedMetadata | function |  | Sent when video's metadata are available. |
| onPause | function |  | Sent when playback pauses after the pause method returns. |
| onPlay | function |  | Sent when playback starts after the `play` method returns. |
| onPlaying | function |  | Sent when the content media resource playback has started. |
| onProgress | function |  | Sent when the browser is fetching the media data. |
| onQualitiesAvailable | function |  | Sent when qualities are available – see `qualities` for accepted values. |
| onQualityChange | function |  | Sent when the current quality changes. |
| onSeeked | function |  | Sent when the player has completed a seeking operation. |
| onSeeking | function |  | Sent when the player is starting to seek to another position in the video. |
| onSubtitleChange | function |  | Sent when the current subtitle changes. |
| onSubtitlesAvailable | function |  | Sent when subtitles are available. |
| onStart | function |  | Sent the first time the player attempts to start the playback, either because of a user interaction, an autoplay parameter, or an API call (e.g play(), load(), etc.). |
| onTimeUpdate | function |  | Sent when the playback position changes as part of normal playback or because of some other condition. |
| onVideoStart | function |  | Sent when the player starts to play the content media resource. |
| onVideoEnd | function |  | Sent when the player reaches the end of the content media resource. |
| onVolumeChange | function |  | Sent when the player volume or mute state has changed. |
| onWaiting | function |  | Sent when the player has to stop video playback for further buffering of content. |

## License

[MIT]

[Install]: #install
[Usage]: #usage
[Props]: #props
[Demo]: https://u-wave.github.io/react-dailymotion
[Demo source code]: ./example
[MIT]: ./LICENSE
