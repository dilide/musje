/* global musje */

(function (musje) {
  'use strict';

  var defineProperty = Object.defineProperty;

  function extendClass(className) {
    defineProperty(musje[className].prototype, 'x', {
      get: function () {
        return this._x;
      },
      set: function (x) {
        this._x = x;
        if (this.el) {
          this.el.attr('x', x);
        }
      }
    });

    defineProperty(musje[className].prototype, 'y', {
      get: function () {
        return this._y;
      },
      set: function (y) {
        this._y = y;
        if (this.el) { this.el.attr('y', y); }
      }
    });

    defineProperty(musje[className].prototype, 'systemX', {
      get: function () {
        return this.x + this.cell.x + this.cell.measure.x;
      }
    });

    defineProperty(musje[className].prototype, 'width', {
      get: function () {
        return this.def.width;
      },
      // set: function (w) {
      //   this._w = w;
      // }
    });
  }

  ['Time', 'Bar', 'Note', 'Rest'].forEach(extendClass);

}(musje));
