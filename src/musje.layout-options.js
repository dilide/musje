var musje = musje || {};

(function () {
  'use strict';

  musje.layoutOptions = {
    width: 1200,
    height: 300,
    marginTop: 15,
    marginRight: 10,
    marginBottom: 15,
    marginLeft: 10,
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
    titleFontSize: 32,
    // titleFontFamily
    titleFontWeight: 'heavy',
    authorFontSize: 24,
    // authorFontFamily
    // authorFontWeight
    // authorFontStyle
    // headerToBody
  };
}());
