import React from 'react';
import { createRoot } from 'react-dom/client';
import { styled } from '@stitches/react';
import YouTube from '@u-wave/react-youtube';

const {
  useCallback,
  useState,
} = React;

const Link = styled('a', {
  color: '#c72e6c',
  textDecoration: 'underline',
  '&:visited': { color: '#c72e6c' },
});
const Label = styled('label', {
  cursor: 'pointer',
  fontSize: '1rem',
  '& input': { marginRight: '.5rem' },
});
const H1 = styled('h1', {
  fontWeight: 400,
  fontSize: '3rem',
});
const H5 = styled('h5', {
  margin: '1.0933333333rem 0 .656rem 0',
  fontWeight: 400,
  fontSize: '1.64rem',
  lineHeight: '110%',
});
const Input = styled('input', {
  '&[type="range"]': {
    background: 'transparent',
    appearance: 'none',
    cursor: 'pointer',
    margin: '1rem 0',
    padding: 0,
    outline: 'none',
    width: '16rem',
    accentColor: '#9d2053',

    '&::-moz-range-track, &::-webkit-slider-runnable-track': {
      height: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.38)',
    },
    '&::-moz-range-thumb, &::-webkit-slider-thumb': {
      border: 'none',
      width: 14,
      height: 14,
      background: '#9d2053',
      marginTop: -5,
      borderRadius: 9999,
    },
  },
});

const Nav = styled('nav', {
  backgroundColor: '#9d2053',
  color: 'white',
  padding: '0 2rem',
  display: 'flex',
  alignItems: 'center',
  height: '64px',
  gap: '2rem',
});
const NavButton = styled('a', {
  color: 'white',
  padding: '.75rem',
  borderRadius: '4px',
  textTransform: 'uppercase',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  lineHeight: '1.75',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});

const LogoLink = styled('a', {
  height: '48px',
  lineHeight: '48px',
  '& img': { height: 48 },
});

const List = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  variants: {
    direction: {
      vertical: { flexDirection: 'column' },
      horizontal: { flexDirection: 'row' },
    },
  },
  defaultVariants: {
    direction: 'vertical',
  },
});
const ListItem = styled('li', {
  margin: 0,
  padding: '0 1rem',
  fontSize: '1rem',
  color: 'white',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(48, 48, 54, 0.3)',
      },
    },
  },
});

const Layout = styled('main', {
  display: 'grid',
  gridTemplateAreas: '"header header" "options embed"',
  gridTemplateColumns: '24rem auto',
  gridGap: '1rem',
  margin: 'auto',
  width: 'min-content',
  '@media (max-width: 800px)': {
    gridTemplateAreas: '"header" "embed" "options"',
    gridTemplateColumns: 'auto',
  },
});
const Header = styled('div', {
  gridArea: 'header',
});
const Options = styled('div', {
  gridArea: 'options',
});
const Embed = styled('div', {
  gridArea: 'embed',
});

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

function Example() {
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
    <>
      <Options>
        <H5>Video</H5>
        <List as="div">
          {videos.map((choice, index) => (
            <ListItem
              as="a"
              key={choice.id}
              href={`#!/video/${index}`}
              onClick={() => setVideoIndex(index)}
              active={videoIndex === index}
            >
              {choice.name}
            </ListItem>
          ))}
        </List>
        <H5>Paused</H5>
        <p>
          <Label htmlFor="paused">
            <Input
              type="checkbox"
              id="paused"
              checked={paused}
              onChange={handlePause}
            />
            <span>Paused</span>
          </Label>
        </p>
        <H5>Volume</H5>
        <Input
          type="range"
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleVolume}
        />
      </Options>
      <Embed>
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
      </Embed>
    </>
  );
}

function App() {
  return(
    <>
      <Nav>
        <LogoLink href="https://u-wave.net">
          <img src="https://u-wave.net/images/logo-white.png" alt="" />
        </LogoLink>
        <List direction="horizontal">
          <li><NavButton href="https://hub.u-wave.net/">Join</NavButton></li>
          <li><NavButton href="https://u-wave.net/install">Install</NavButton></li>
          <li><NavButton href="https://u-wave.net/react-youtube">react-youtube</NavButton></li>
        </List>
      </Nav>
      <Layout>
        <Header>
          <H1>@u-wave/react-youtube example</H1>
          <p>
            An example YouTube player using <Link href="https://facebook.github.io/react">React</Link>
            {' '}and <Link href="https://github.com/u-wave/react-youtube">@u-wave/react-youtube</Link>.
            {' '}<Link href="https://github.com/u-wave/react-youtube/tree/default/example">view source</Link>
          </p>
        </Header>
        <Example />
      </Layout>
    </>
  );
}

const root = createRoot(document.getElementById('example'));
root.render(<App />);
