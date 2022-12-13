import {
  describe, it, afterEach, vi, expect,
} from 'vitest';
import render from './util/render';

describe('YouTube', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a YouTube player when mounted', async () => {
    const { sdkMock } = await render({
      video: 'x2y5kyu',
    });
    expect(sdkMock.Player).toHaveBeenCalled();
    expect(sdkMock.Player.calls[0][1]).toMatchObject({ videoId: 'x2y5kyu' });
  });

  it('should load a different video when "video" prop changes', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'x2y5kyu',
    });
    expect(sdkMock.Player).toHaveBeenCalled();
    expect(sdkMock.Player.calls[0][1]).toMatchObject({
      videoId: 'x2y5kyu',
    });

    await rerender({ video: 'x3pn5cb' });

    expect(playerMock.cueVideoById).toHaveBeenCalled();
    expect(playerMock.cueVideoById.calls[0][0]).toMatchObject({
      videoId: 'x3pn5cb',
    });
  });

  it('should stop the video when "video" prop becomes null', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'ZuuVjuLNvFY',
    });
    expect(sdkMock.Player.calls[0][1]).toMatchObject({
      videoId: 'ZuuVjuLNvFY',
    });

    await rerender({ video: null });
    expect(playerMock.stopVideo).toHaveBeenCalled();
    await rerender({ video: 'ld8ugY47cps' });
    expect(playerMock.cueVideoById).toHaveBeenCalled();
  });

  it('should pause the video using the "paused" prop', async () => {
    const { playerMock, rerender } = await render({
      video: 'x2y5kyu',
      autoplay: true,
    });

    // Don't call `play` again when we were already playing
    await rerender({ paused: false });
    expect(playerMock.playVideo).not.toHaveBeenCalled();

    await rerender({ paused: true });
    expect(playerMock.pauseVideo).toHaveBeenCalled();

    await rerender({ paused: false });
    expect(playerMock.playVideo).toHaveBeenCalled();
  });

  it('should set the volume using the "volume" prop', async () => {
    const { playerMock, rerender } = await render({
      video: 'x2y5kyu',
      volume: 0.5,
    });
    expect(playerMock.setVolume).toHaveBeenCalledWith(50);

    await rerender({ volume: 1 });

    expect(playerMock.setVolume).toHaveBeenCalledWith(100);
  });

  it('should mute or unmute the video using the "muted" prop', async () => {
    const { playerMock, rerender } = await render({
      video: 'x2y5kyu',
      volume: 0.5,
      muted: true,
    });
    expect(playerMock.setVolume).toHaveBeenCalledWith(50);
    expect(playerMock.mute).toHaveBeenCalled();

    await rerender({ muted: false });
    expect(playerMock.unMute).toHaveBeenCalled();
    await rerender({ muted: true });
    expect(playerMock.mute).toHaveBeenCalled();
  });

  it('should set the iframe width/height using the width/height props', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'x2y5kyu',
      width: 640,
      height: 320,
    });
    expect(sdkMock.Player.calls[0][1]).toMatchObject({
      width: 640,
      height: 320,
    });

    await rerender({
      width: '100%',
      height: 800,
    });

    expect(playerMock.setSize).toHaveBeenCalledWith('100%', 800);
  });

  it('should respect start/endSeconds', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'pRKqlw0DaDI',
      startSeconds: 30,
      endSeconds: 60,
    });

    expect(sdkMock.Player.calls[0][1]).toMatchObject({
      videoId: 'pRKqlw0DaDI',
      playerVars: {
        start: 30,
        end: 60,
      },
    });

    await rerender({
      video: 'hlk7o5T56iw',
      startSeconds: 40,
      endSeconds: undefined,
    });

    expect(playerMock.cueVideoById).toHaveBeenCalled();
    expect(playerMock.cueVideoById.calls[0][0]).toMatchObject({
      videoId: 'hlk7o5T56iw',
      startSeconds: 40,
      endSeconds: undefined,
    });
  });

  it('should only call loadVideoById when autoplay is enabled', async () => {
    const { playerMock, rerender } = await render({
      video: 'x2y5kyu',
    });
    await rerender({ video: 'x3pn5cb' });

    expect(playerMock.cueVideoById).toHaveBeenCalled();
    expect(playerMock.loadVideoById).not.toHaveBeenCalled();

    playerMock.cueVideoById.reset();

    await rerender({
      autoplay: true,
      video: 'r6534246435',
    });

    expect(playerMock.cueVideoById).not.toHaveBeenCalled();
    expect(playerMock.loadVideoById).toHaveBeenCalled();
  });
});
