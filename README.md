# @u-wave/react-youtube
YouTube player component for React.

[Install][] - [Usage][] - [Demo][] - [Component API][] - [Hook API][]

## Install
```
npm install @u-wave/react-youtube
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

<a id="component"></a>
## `<YouTube />`
The `<YouTube />` component renders an iframe and attaches the YouTube player to it. It supports all the
same options as the `useYouTube` hook, plus a few to configure the iframe. If you need to do more with
the iframe than this component provides, consider using the `useYouTube` hook directly.

### Props

| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| id | string |  | DOM ID for the player element. |
| className | string |  | CSS className for the player element. |
| style | ReactCSSProperties |  | Inline style for player element. |
| video | string | null |  | An 11-character string representing a YouTube video ID. |
| width | number | string |  | Width of the player element. |
| height | number | string |  | Height of the player element. |
| host | string |  | YouTube host to use: 'https://www.youtube.com' or 'https://www.youtube-nocookie.com'. |
| origin | string |  | The YouTube API will usually default this value correctly. It is exposed for completeness. |
| paused | boolean |  | Pause the video. |
| autoplay | boolean |  | Whether the video should start playing automatically.<br>https://developers.google.com/youtube/player_parameters#autoplay |
| showCaptions | boolean |  | Whether to show captions below the video.<br>https://developers.google.com/youtube/player_parameters#cc_load_policy |
| controls | boolean |  | Whether to show video controls.<br>https://developers.google.com/youtube/player_parameters#controls |
| disableKeyboard | boolean |  | Ignore keyboard controls.<br>https://developers.google.com/youtube/player_parameters#disablekb |
| allowFullscreen | boolean |  | Whether to display the fullscreen button.<br>https://developers.google.com/youtube/player_parameters#fs |
| lang | string |  | The player's interface language. The parameter value is an ISO 639-1 two-letter language code or a fully specified locale.<br>https://developers.google.com/youtube/player_parameters#hl |
| annotations | boolean |  | Whether to show annotations on top of the video.<br>https://developers.google.com/youtube/player_parameters#iv_load_policy |
| startSeconds | number |  | Time in seconds at which to start playing the video.<br>https://developers.google.com/youtube/player_parameters#start |
| endSeconds | number |  | Time in seconds at which to stop playing the video.<br>https://developers.google.com/youtube/player_parameters#end |
| playsInline | boolean |  | Whether to play the video inline on iOS, instead of fullscreen.<br>https://developers.google.com/youtube/player_parameters#playsinline |
| showRelatedVideos | boolean |  | Whether to show related videos from other channels after the video is over.<br>When `false`, only related videos from the same channel as the previous video are shown.<br>https://developers.google.com/youtube/player_parameters#rel |
| volume | number |  | The playback volume, **as a number between 0 and 1**. |
| muted | boolean |  | Whether the video's sound should be muted. |
| playbackRate | number |  | Playback speed.<br>https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate |
| onReady | YT.PlayerEventHandler |  | Sent when the YouTube player API has loaded. |
| onError | YT.PlayerEventHandler |  | Sent when the player triggers an error. |
| onCued | YT.PlayerEventHandler |  | Sent when the video is cued and ready to play. |
| onBuffering | YT.PlayerEventHandler |  | Sent when the video is buffering. |
| onPlaying | YT.PlayerEventHandler |  | Sent when playback has been started or resumed. |
| onPause | YT.PlayerEventHandler |  | Sent when playback has been paused. |
| onEnd | YT.PlayerEventHandler |  | Sent when playback has stopped. |
| onStateChange | YT.PlayerEventHandler |  |  |
| onPlaybackRateChange | YT.PlayerEventHandler |  |  |
| onPlaybackQualityChange | YT.PlayerEventHandler |  |  |

<a id="hook"></a>
## `useYouTube(container, options)`
Create a YouTube player at `container`. `container` must be a ref object.

Returns the `YT.Player` object, or `null` until the player is ready.

```js
import { useYouTube } from '@u-wave/react-youtube';

function Player() {
  const container = useRef(null);
  const player = useYouTube(container, {
    video: 'x2to0hs',
    autoplay: true,
  });
  console.log(player?.getVideoUrl());
  return <div ref={container} />;
}
```

### Options
| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| video | string | null |  | An 11-character string representing a YouTube video ID. |
| width | number | string |  | Width of the player element. |
| height | number | string |  | Height of the player element. |
| host | string |  | YouTube host to use: 'https://www.youtube.com' or 'https://www.youtube-nocookie.com'. |
| origin | string |  | The YouTube API will usually default this value correctly. It is exposed for completeness. |
| paused | boolean |  | Pause the video. |
| autoplay | boolean |  | Whether the video should start playing automatically.<br>https://developers.google.com/youtube/player_parameters#autoplay |
| showCaptions | boolean |  | Whether to show captions below the video.<br>https://developers.google.com/youtube/player_parameters#cc_load_policy |
| controls | boolean |  | Whether to show video controls.<br>https://developers.google.com/youtube/player_parameters#controls |
| disableKeyboard | boolean |  | Ignore keyboard controls.<br>https://developers.google.com/youtube/player_parameters#disablekb |
| allowFullscreen | boolean |  | Whether to display the fullscreen button.<br>https://developers.google.com/youtube/player_parameters#fs |
| lang | string |  | The player's interface language. The parameter value is an ISO 639-1 two-letter language code or a fully specified locale.<br>https://developers.google.com/youtube/player_parameters#hl |
| annotations | boolean |  | Whether to show annotations on top of the video.<br>https://developers.google.com/youtube/player_parameters#iv_load_policy |
| startSeconds | number |  | Time in seconds at which to start playing the video.<br>https://developers.google.com/youtube/player_parameters#start |
| endSeconds | number |  | Time in seconds at which to stop playing the video.<br>https://developers.google.com/youtube/player_parameters#end |
| playsInline | boolean |  | Whether to play the video inline on iOS, instead of fullscreen.<br>https://developers.google.com/youtube/player_parameters#playsinline |
| showRelatedVideos | boolean |  | Whether to show related videos from other channels after the video is over.<br>When `false`, only related videos from the same channel as the previous video are shown.<br>https://developers.google.com/youtube/player_parameters#rel |
| volume | number |  | The playback volume, **as a number between 0 and 1**. |
| muted | boolean |  | Whether the video's sound should be muted. |
| playbackRate | number |  | Playback speed.<br>https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate |
| onReady | YT.PlayerEventHandler |  | Sent when the YouTube player API has loaded. |
| onError | YT.PlayerEventHandler |  | Sent when the player triggers an error. |
| onCued | YT.PlayerEventHandler |  | Sent when the video is cued and ready to play. |
| onBuffering | YT.PlayerEventHandler |  | Sent when the video is buffering. |
| onPlaying | YT.PlayerEventHandler |  | Sent when playback has been started or resumed. |
| onPause | YT.PlayerEventHandler |  | Sent when playback has been paused. |
| onEnd | YT.PlayerEventHandler |  | Sent when playback has stopped. |
| onStateChange | YT.PlayerEventHandler |  |  |
| onPlaybackRateChange | YT.PlayerEventHandler |  |  |
| onPlaybackQualityChange | YT.PlayerEventHandler |  |  |

## Related
 - [react-youtube][] - A widely-used YouTube component. Its API matches the YouTube iframe API more closely, and it doesn't support prop-based volume/quality/playback changes.
 - [@u-wave/react-vimeo][] - A Vimeo component with a similar declarative API.

## License
[MIT][]

[Install]: #install
[Usage]: #usage
[Component API]: #component
[Hook API]: #hook
[Demo]: https://u-wave.net/react-youtube
[Demo source code]: ./example
[MIT]: ./LICENSE
[react-youtube]: https://github.com/tjallingt/react-youtube
[@u-wave/react-vimeo]: https://github.com/u-wave/react-vimeo
