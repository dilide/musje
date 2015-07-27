
var musje = musje || {};

(function () {
  'use strict';

  musje.layoutOptions = {
    mode: 'block', // inline | block | paper
    width: 550,
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
    fontSize: 20,   // in pixel
    fontFamily: 'Helvetica, Arial, Sans Serif',
    titleFontSize: 22,
    // titleFontFamily
    titleFontWeight: 'bold',
    composerFontSize: 20,
    // composerFontFamily:
    composerFontWeight: 'bold',
    // composerFontStyle,
    timeFontSize: 18,
    timeFontWeight: 'bold',

    headerSep: 1,
    musicDataSep: 0.2,

    accidentalFontSize: 0.7,
    accidentalShift: 0.3,

    octaveRadius: 0.066,
    octaveOffset: 0.0,
    octaveSep: 0.23,

    stepBaselineShift: 0.12,
    typeStrokeWidth: 0.05,
    underlineSep: 0.17,

  };
}());
