# @u-wave/react-youtube

YouTube player component for React.

[Install][] - [Usage][] - [Demo][] - [Props][]

## Install

```
npm install --save @u-wave/react-youtube
```

## Usage

[Demo][] - [Demo source code][]

```js
import YouTube from '@u-wave/react-youtube';

<YouTube
  video="x2to0hs"
  autoplay
/>
```

## Props

| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| video | string |  | An 11-character string representing a YouTube video ID.. |
| id | string |  | DOM ID for the player element. |
| className | string |  | CSS className for the player element. |
| width | union |  | Width of the player element. |
| height | union |  | Height of the player element. |
| paused | bool |  | Pause the video. |
| autoplay | bool | false | Whether the video should start playing automatically.<br>https://developers.google.com/youtube/player_parameters#autoplay |
| showCaptions | bool | false | Whether to show captions below the video.<br>https://developers.google.com/youtube/player_parameters#cc_load_policy |
| controls | bool | true | Whether to show video controls.<br>https://developers.google.com/youtube/player_parameters#controls |
| disableKeyboard | bool | false | Ignore keyboard controls.<br>https://developers.google.com/youtube/player_parameters#disablekb |
| allowFullscreen | bool | true | Whether to display the fullscreen button.<br>https://developers.google.com/youtube/player_parameters#fs |
| lang | string |  | The player's interface language. The parameter value is an ISO 639-1 two-letter language code or a fully specified locale.<br>https://developers.google.com/youtube/player_parameters#hl |
| annotations | bool | true | Whether to show annotations on top of the video.<br>https://developers.google.com/youtube/player_parameters#iv_load_policy |
| startSeconds | number |  | Time in seconds at which to start playing the video.<br>https://developers.google.com/youtube/player_parameters#start |
| endSeconds | number |  | Time in seconds at which to stop playing the video.<br>https://developers.google.com/youtube/player_parameters#end |
| modestBranding | bool | false | Remove most YouTube logos from the player.<br>https://developers.google.com/youtube/player_parameters#modestbranding |
| playsInline | bool | false | Whether to play the video inline on iOS, instead of fullscreen.<br>https://developers.google.com/youtube/player_parameters#playsinline |
| showRelatedVideos | bool | true | Whether to show related videos after the video is over.<br>https://developers.google.com/youtube/player_parameters#rel |
| showInfo | bool | true | Whether to show video information (uploader, title, etc) before the video starts.<br>https://developers.google.com/youtube/player_parameters#showinfo |
| volume | number |  | The playback volume, **as a number between 0 and 1**. |
| muted | bool |  | Whether the video's sound should be muted. |
| suggestedQuality | string |  | The suggested playback quality.<br>https://developers.google.com/youtube/iframe_api_reference#Playback_quality |
| playbackRate | number |  | Playback speed.<br>https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate |
| onReady | function |  | Sent when the YouTube player API has loaded. |
| onError | function |  | Sent when the player triggers an error. |
| onCued | function | () => {} | Sent when the video is cued and ready to play. |
| onBuffering | function | () => {} | Sent when the video is buffering. |
| onPlaying | function | () => {} | Sent when playback has been started or resumed. |
| onPause | function | () => {} | Sent when playback has been paused. |
| onEnd | function | () => {} | Sent when playback has stopped. |
| onStateChange | function |  |  |
| onPlaybackRateChange | function |  |  |
| onPlaybackQualityChange | function |  |  |

## Related

 - [react-dailymotion][] - A Dailymotion component with a similar declarative API.
 - [@u-wave/react-vimeo][] - A Vimeo component with a similar declarative API.

## License

[MIT]

[Install]: #install
[Usage]: #usage
[Props]: #props
[Demo]: https://u-wave.net/react-youtube
[Demo source code]: ./example
[MIT]: ./LICENSE
[react-dailymotion]: https://github.com/u-wave/react-dailymotion
[@u-wave/react-vimeo]: https://github.com/u-wave/react-vimeo
