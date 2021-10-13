/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import YouTube from '..';

const {
  useCallback,
  useState,
} = React;

const videos = [
  { id: 'ZuuVjuLNvFY', name: 'JUNNY - kontra (Feat. Lil Gimch, Keeflow)' },
  { id: 'PYE7jXNjFWw', name: 'T W L V - Follow' },
  { id: 'ld8ugY47cps', name: 'SLCHLD - I can\'t love you anymore' },
  { id: null, name: '<none>' },
];

const qualities = ['auto', '240', '380', '480', '720', '1080', '1440', '2160'];

const hashVideoRx = /^#!\/video\/(\d)$/;
const hash = typeof window.location !== 'undefined'
  ? window.location.hash : ''; // eslint-disable-line no-undef
const defaultVideo = hashVideoRx.test(hash)
  ? parseInt(hash.replace(hashVideoRx, '$1'), 10)
  : 0;

function App() {
  const [videoIndex, setVideoIndex] = useState(defaultVideo);
  const [suggestedQuality, setSuggestedQuality] = useState('auto');
  const [volume, setVolume] = useState(1);
  const [paused, setPaused] = useState(false);

  const video = videos[videoIndex];

  function selectVideo(index) {
    setVideoIndex(index);
  }

  const handlePause = useCallback((event) => {
    setPaused(event.target.checked);
  }, []);

  const handlePlayerPause = useCallback(() => {
    setPaused(true);
  }, []);

  const handlePlayerPlay = useCallback(() => {
    setPaused(false);
  }, []);

  const handleVolume = useCallback((event) => {
    setVolume(parseFloat(event.target.value));
  }, []);

  const handleQuality = useCallback((event) => {
    setSuggestedQuality(qualities[event.target.selectedIndex]);
  }, []);

  return (
    <div className="row">
      <div className="col s4">
        <h5>
          Video
        </h5>
        <div className="collection">
          {videos.map((choice, index) => (
            <a
              key={choice.id}
              href={`#!/video/${index}`}
              className={`collection-item ${video === choice ? 'active' : ''}`}
              onClick={() => selectVideo(index)}
            >
              {choice.name}
            </a>
          ))}
        </div>
        <h5>
          Paused
        </h5>
        <p>
          <label htmlFor="paused">
            <input
              type="checkbox"
              id="paused"
              checked={paused}
              onChange={handlePause}
            />
            <span>Paused</span>
          </label>
        </p>
        <h5>
          Volume
        </h5>
        <input
          type="range"
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleVolume}
        />
        <h5>
          Quality
        </h5>
        <select className="browser-default" onChange={handleQuality}>
          {qualities.map((quality) => (
            <option key={quality} value={quality}>
              {quality}
            </option>
          ))}
        </select>
      </div>
      <div className="col s8 center-align">
        <YouTube
          video={video.id}
          width={640}
          height={480}
          autoplay
          controls={false}
          suggestedQuality={suggestedQuality}
          volume={volume}
          paused={paused}
          onPause={handlePlayerPause}
          onPlaying={handlePlayerPlay}
        />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('example'));
