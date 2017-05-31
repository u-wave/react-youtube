/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import YouTube from '../';

const videos = [
  { id: 'ZuuVjuLNvFY', name: 'JUNNY - kontra (Feat. Lil Gimch, Keeflow)' },
  { id: 'PYE7jXNjFWw', name: 'T W L V - Follow' },
  { id: 'ld8ugY47cps', name: 'SLCHLD - I can\'t love you anymore' },
  { id: null, name: '<none>' },
];

const qualities = ['auto', '240', '380', '480', '720', '1080', '1440', '2160'];

const hashVideoRx = /^#!\/video\/(\d)$/;
const hash = typeof location !== 'undefined' ?
  location.hash : ''; // eslint-disable-line no-undef
const defaultVideo = hashVideoRx.test(hash) ?
  parseInt(hash.replace(hashVideoRx, '$1'), 10) :
  0;

class App extends React.Component {
  state = {
    video: defaultVideo,
    suggestedQuality: 'auto',
    volume: 1,
    paused: false,
  };

  selectVideo(index) {
    this.setState({ video: index });
  }

  handlePause = (event) => {
    this.setState({
      paused: event.target.checked,
    });
  };

  handlePlayerPause = () => {
    this.setState({ paused: true });
  };
  handlePlayerPlay = () => {
    this.setState({ paused: false });
  };

  handleVolume = (event) => {
    this.setState({
      volume: parseFloat(event.target.value),
    });
  };

  handleQuality = (event) => {
    this.setState({
      suggestedQuality: qualities[event.target.selectedIndex],
    });
  };

  render() {
    const video = videos[this.state.video];
    return (
      <div className="row">
        <div className="col s3">
          <h3>Video</h3>
          <div className="collection">
            {videos.map((choice, index) => (
              <a
                key={choice.id}
                href={`#!/video/${index}`}
                className={`collection-item ${video === choice ? 'active' : ''}`}
                onClick={() => this.selectVideo(index)}
              >
                {choice.name}
              </a>
            ))}
          </div>
          <h3>Paused</h3>
          <p>
            <input
              type="checkbox"
              id="paused"
              checked={this.state.paused}
              onChange={this.handlePause}
            />
            <label htmlFor="paused">
              Paused
            </label>
          </p>
          <h3>Volume</h3>
          <input
            type="range"
            value={this.state.volume}
            min={0}
            max={1}
            step={0.01}
            onChange={this.handleVolume}
          />
          <h3>Quality</h3>
          <select className="browser-default" onChange={this.handleQuality}>
            {qualities.map(quality => (
              <option key={quality} value={quality}>{quality}</option>
            ))}
          </select>
        </div>
        <div className="col s9 center-align">
          <YouTube
            video={video.id}
            width={640}
            height={480}
            autoplay
            controls={false}
            suggestedQuality={this.state.suggestedQuality}
            volume={this.state.volume}
            paused={this.state.paused}
            onPause={this.handlePlayerPause}
            onPlaying={this.handlePlayerPlay}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
