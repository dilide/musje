
var musje = musje || {};

(function () {
  'use strict';

  var layoutOptions = musje.layoutOptions = {
    mode: 'block', // inline | block | paper
    width: 650,
    height: 300,
    marginTop: 25,
    marginRight: 30,
    marginBottom: 25,
    marginLeft: 30,
    margin: {
      get: function () {
        return [this.marginTop, this.marginRight, this.marginBottom, this.marginLeft];
      },
      set: function (arr) {
        switch (arr.length) {
        case 1:
          this.marginTop = this.marginRight = this.marginBottom = this.marginLeft = arr[0];
          return;
        case 2:
          this.marginTop = this.marginBottom = arr[0];
          this.marginRight = this.marginLeft = arr[1];
          return;
        case 4:
          this.marginTop = arr[0];
          this.marginRight = arr[1];
          this.marginBottom = arr[2];
          this.marginLeft = arr[3];
          return;
        default:
          throw new Error('Invalid input for margin.');
        }
      }
    },
    fontSize: 20,
    fontFamily: 'Helvetica, Arial, Sans Serif',

    titleFontSize: '110%',
    // titleFontFamily
    titleFontWeight: 'bold',
    composerFontSize: '100%',
    // composerFontFamily:
    composerFontWeight: 'bold',
    // composerFontStyle,
    timeFontSize: '90%',
    timeFontWeight: 'bold',

    headerSep: '100%',
    musicDataSep: '20%',

    accidentalFontSize: '70%',
    accidentalShift: '30%',

    octaveRadius: '6.6%',
    octaveOffset: '0%',
    octaveSep: '23%',

    stepBaselineShift: '12%',  // shift the baseline of step up with

    typeStrokeWidth: '5%',
    underbarSep: '17%',
    typebarWidth: '60%',
    typebarOffset: '30%',
    typebarSep: '50%',
    dotRadius: '66%',
    // dotOffset:
    dotSep: '30%'
  };

  var fontSize = layoutOptions.fontSize;

  musje.objForEach(layoutOptions, function (value, key) {
    if (typeof value !== 'string') { return; }

    var unit = value.replace(/[\d\.]+/, '');
    value = +value.replace(/[^\d\.]+/, '');

    switch (unit) {
    case '%':
      layoutOptions[key] = fontSize * value / 100;
      break;
    case '': // fall through
    case 'px':
      layoutOptions[key] = value;
      break;
    case 'others to be implemented':
      break;
    }
  });
}());
