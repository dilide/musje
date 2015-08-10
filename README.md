# musje [![NPM version][npm-image]][npm-url] [![Dependency Status][depstat-image]][depstat-url]

Musje - 123 jianpu music processor.

Musje consists of

- parser
- model
- renderer
- player


## Usage

```js
var score = musje.parse(musjeString);
score.render(svgSelector, layoutOptions);
score.play();
score.stop();
```


## Develop

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
gulp build
```
or ```gulp``` will run the build by default.

### Demo
```
gulp demo
```


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[npm-url]: https://npmjs.org/package/musje
[npm-image]: https://badge.fury.io/js/musje.png

[depstat-url]: https://david-dm.org/jianpu/musje
[depstat-image]: https://david-dm.org/jianpu/musje.png
