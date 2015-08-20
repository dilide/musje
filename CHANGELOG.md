# Musje Change Log

## 0.2.1

- Add this change log file.

### Features

- Ties can be rendererd.


## 0.2.0 (2015-08-19)

- In demo page, note that is played can be seen by the color changes.

### Breaking changes

- model schema changed. Cell is now { data: [/* musicData */] }


## 0.1.3 (2015-08-16)

- In demo page, window resize can trigger score rerender.
- Refactor model.

### Features

- Add stroke for smaller pitch font.

### Bug fixes

- Fix the first/last barline error and empty measure error.
- Fix dot y position.


## 0.1.2 (2015-08-14)

- Lots of refactoring and code clean up.
- Refactor Defs and Layout.
- Implement Renderer.renderBar.
- Add README for renderer and refactor filenames.

### Features

- Improve layout results.
- Improve bar render results.

### Bug fixes

- Fix Defs.PitchDef error.


## 0.1.1 (2015-08-12)

- Sub-divide many parts in Layout and Renerer.
- Extract out Layout.System class.
- Refactor variable names, and layoutCell, layout.options.

### Features

- Measure width can be tuned in a "good" position automatically.
- Barlines are in correct place now.

### Bug fixes

- renderBar back in work.


## 0.1.0 (2015-08-10)

- Publish musje to the npm registry.
- Improve gulpfile, and use gulp-sourcemaps.
- Upgrade tv4 for the demo page.
- Layout become a class and together with the renderer, been rewriten.


## 0.0.2 (2015-08-09)

- Several leap improvement for this release.
- The SVG Lib d3.js dropped, use Snapsvg instead for simplicity sake.
- Renderer now has three main parts, namely, Defs, Layout and Renderer.
- Use gulp task runner to help development cycles.
- Demo page improved using AngularJS and Bootstrap (jQuery dropped).

### Features

- New score renderer implemented.
- Basic note (with accidental, step, octave, type and dot)
  and rest can be rendered.
- Notes shorter than a quarter can be automatically beamed.
- Score can be played using the MIDI.js lib.
- Add musje-logo.svg musje-log.png files.


## 0.0.1 (2015-07-24)

- The repo is picked up again for furthur development.
- Repo transfer from https://github.com/malcomwu/musje.git
  to https://github.com/jianpu/musje.git
- Code clean up. Use vanilla javascript as much as possible.


## 0.0.0 (2014-01-23)

- Build infrastructur

### Features

- Musje 123 parser implemented
