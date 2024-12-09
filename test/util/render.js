/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
// Doing this after React is loaded makes React do a bit less DOM work
import 'min-react-env/install';
import createYouTube from './createYouTube';

const reactMajor = parseInt((ReactDOM.version || '16').split('.')[0], 10);

async function render(initialProps) {
  const { YouTube, sdkMock, playerMock } = createYouTube();

  let component;
  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(ytProps) {
      super(ytProps);

      this.state = { props: ytProps };
    }

    render() {
      const { props } = this.state;

      return (
        <YouTube
          ref={(youtube) => { component = youtube; }}
          {...props}
        />
      );
    }
  }

  const div = document.createElement('div');
  let root;
  if (reactMajor >= 18) {
    const { createRoot } = await import('react-dom/client');
    root = createRoot(div);
  } else {
    root = {
      render(element) {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(element, div);
      },
      unmount() {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.unmountComponentAtNode(div);
      },
    };
  }
  const container = await new Promise((resolve) => {
    root.render(<Container {...initialProps} ref={resolve} />);
  });

  function rerender(newProps) {
    return new Promise((resolve) => {
      container.setState({ props: newProps }, () => {
        Promise.resolve().then(resolve);
      });
    });
  }

  function unmount() {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(div);
  }

  return component.player.then(() => ({
    sdkMock,
    playerMock,
    component,
    rerender,
    unmount,
  }));
}

export default render;
