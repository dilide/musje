/* global musje */

(function (musje) {
  'use strict';

  var options = musje.Layout.options = {
    mode: 'block', // inline | block | paper
    width: 650,
    // height: 600,
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
    fontSize: 22,
    fontFamily: 'Helvetica, Arial, Sans Serif',

    titleFontSize: '110%',
    // titleFontFamily
    titleFontWeight: 'bold',
    composerFontSize: '90%',
    // composerFontFamily:
    composerFontWeight: 'bold',
    // composerFontStyle,
    timeFontSize: '95%',
    timeFontWeight: 'bold',

    headerSep: '100%',
    systemSep: '150%',
    musicDataSep: '20%',

    measurePaddingLeft: '50%',
    measurePaddingRight: '50%',

    thinBarlineWidth: '5%',
    thickBarlineWidth: '16%',
    barlineSep: '15%',
    barlineRadius: '6.6%',

    accidentalFontSize: '95%',
    accidentalShift: '10%',

    octaveRadius: '6.6%',
    octaveOffset: '0%',
    octaveSep: '23%',

    stepBaselineShift: '12%',  // for step without lower octave and underline

    typeStrokeWidth: '5%',
    typebarOffset: '30%',   // 1 - - -
    typebarLength: '55%',   // off len sep len sep len (dot) ext
    typebarSep: '45%',      // 1 -
    typebarExt: '20%',      // off len (dot) ext
    underbarSep: '17%',

    dotOffset: '60%',       // for type = 2
    dotRadius: '6.6%',      // 1 - . .
    dotSep: '60%',          // off len dotOff . dotSep . ext
    t4DotOffset: '15%',
    t4DotSep: '50%',
    t4DotExt: '25%',
    t4DotBaselineShift: '20%'
  };

  var fontSize = options.fontSize;

  musje.objForEach(options, function (value, key) {
    if (typeof value !== 'string') { return; }

    var unit = value.replace(/[\d\.]+/, '');
    value = +value.replace(/[^\d\.]+/, '');

    switch (unit) {
    case '%':
      options[key] = fontSize * value / 100;
      break;
    case '': // fall through
    case 'px':
      options[key] = value;
      break;
    case 'others to be implemented':
      break;
    }
  });
}(musje));
