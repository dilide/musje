# musje [![NPM version][npm-image]][npm-url] [![Dependency Status][depstat-image]][depstat-url]

Musje - 123 jianpu music processor.

Musje consists of

- parser
- model
- renderer
- player


Usage
-----
```js
var score = musje.parse(musjeString);
score.render(svgSelector, layoutOptions);
score.play();
score.stop();
```

Build
-----

### Install
Install node.js first and install gulp globally
```
npm install -g gulp
```
Clone this repo and in the project folder
```
npm install
```

### Build
```
gulp
```