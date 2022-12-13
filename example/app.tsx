import React from 'react';
import { createRoot } from 'react-dom/client';
import YouTube from '@u-wave/react-youtube';

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

function getInitialVideo() {
  const hashVideoRx = /^#!\/video\/(\d)$/;
  const hash = typeof window.location !== 'undefined' ? window.location.hash : '';
  return hashVideoRx.test(hash)
    ? parseInt(hash.replace(hashVideoRx, '$1'), 10)
    : 0;
}

function App() {
  const [videoIndex, setVideoIndex] = useState(getInitialVideo);
  const [volume, setVolume] = useState(1);
  const [paused, setPaused] = useState(false);

  const video = videos[videoIndex];

  const handlePause = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPaused(event.target.checked);
  }, []);

  const handlePlayerPause = useCallback(() => {
    setPaused(true);
  }, []);

  const handlePlayerPlay = useCallback(() => {
    setPaused(false);
  }, []);

  const handleVolume = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
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
              onClick={() => setVideoIndex(index)}
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
      </div>
      <div className="col s8 center-align">
        <YouTube
          video={video.id}
          width={640}
          height={480}
          autoplay
          controls={false}
          volume={volume}
          paused={paused}
          onPause={handlePlayerPause}
          onPlaying={handlePlayerPlay}
        />
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('example'));
root.render(<App />);
