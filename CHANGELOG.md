# @u-wave/react-youtube change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

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
