/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import 'min-react-env/install';
import createYouTube from './createYouTube';

const reactMajor = parseInt((ReactDOM.version || '16').split('.')[0], 10);

async function render(initialProps) {
  const { YouTube, sdkMock, playerMock } = createYouTube();

  let resolveReady;
  const readyPromise = new Promise((resolve) => {
    resolveReady = resolve;
  });

  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(ytProps) {
      super(ytProps);

      this.state = { props: ytProps };
    }

    render() {
      const { props } = this.state;

      const onReady = (event) => {
        resolveReady();
        props.onReady?.(event);
      };

      return (
        <YouTube
          {...props}
          onReady={onReady}
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

  const container = new Promise((resolve) => {
    act(() => {
      root.render(<Container {...initialProps} ref={resolve} />);
    });
  });
  await readyPromise;

  async function rerender(newProps) {
    const wrapper = await container;

    act(() => {
      wrapper.setState({ props: newProps });
    });
  }

  return {
    sdkMock,
    playerMock,
    rerender,
    unmount() {
      root.unmount();
    },
  };
}

export default render;
