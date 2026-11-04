# @u-wave/react-youtube change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## 1.0.0 - 2026-11-04

This release promotes v1.0.0-rc.1 to latest. This changelog entry lists changes compared to v0.x. If you were using a prerelease version of 1.0.0, see the [prerelease changelog](https://github.com/u-wave/react-youtube/blob/41a403461a9397839ba7c4aae856882b67df79e7/CHANGELOG.md).

Breaking:
 * Drop support for React 16. This package is now tested with React 17, 18, and 19.
 * Target evergreen browsers. If you need to support older browsers, you need to transpile this dependency.
 * Remove runtime type checking using `YouTube.propTypes`.
 * Remove props no longer supported by YouTube: `showInfo`, `suggestedQuality`, `modestBranding`.

Features:
 * Expose all functionality as a `useYouTube` hook. The `<YouTube />` component is now a small wrapper around this hook.
 * Add props for `origin` / `host` settings.

## 0.7.4 - 2022-04-23
 * Fix a warning about workspaces when installing with yarn.

## 0.7.3 - 2022-04-04
 * Allow React 18 in peerDependency range.
 * Test with React 16, 17, and 18 on CI.

## 0.7.2 - 2020-10-21
 * Allow React 17 in peerDependency range.
 * Test with React 16 and React 17 on CI.

## 0.7.1 - 2020-04-01
 * Set `sideEffects: false` in package.json.
 * Add `style` pass-through property to set CSS properties on the container element. (@Authchirion in #90)
 * Document that the `showInfo` prop is deprecated.

## 0.7.0 - 2019-06-12
 * Add typescript definitions.

## 0.6.0 - 2018-06-11
 * Cue instead of load video when autoplay is disabled, see [#24](https://github.com/u-wave/react-youtube/issues/24).
 * Fix event passthrough, see [#26](https://github.com/u-wave/react-youtube/issues/26).

## 0.5.0 - 2018-05-24
* Update demo URL.
* Change the build paths from `lib/rollup.js` to `dist/react-youtube.js`, for consistency with other modules under the `u-wave` org.
