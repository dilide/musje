/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var Measures = Layout.Measures = function (system) {
    this._system = system;
    this._value = [];
  };

  Measures.prototype.init = function () {
    var x = 0;
    this.tuneWidths();
    this.forEach(function (measure) {
      measure.x = x;
      x += measure.width;
    });
  };

  Measures.prototype.forEach = function (cb) {
    this._value.forEach(cb);
  };

  Measures.prototype.push = function (cb) {
    this._value.push(cb);
  };

  Measures.prototype.map = function (cb) {
    return this._value.map(cb);
  };

  Measures.prototype._getPairs = function () {
    return this.map(function (measure) {
      return {
        width: measure.minWidth,
        measure: measure
      };
    }).sort(function (a, b) {
      return b.width - a.width;   // descending sort
    });
  };

  Measures.prototype.tuneWidths = function () {
    var
      systemWidth = this._system.width,
      pairs = this._getPairs(),
      length = pairs.length,
      widthLeft = systemWidth,
      itemLeft = length,
      i = 0,    // i + itemLeft === length
      width;

    while (i < length) {
      if (widthLeft >= pairs[i].width * itemLeft) {
        width = widthLeft / itemLeft;
        do {
          pairs[i].measure.width = width;
          i++;
        } while (i < length);
        break;
      } else {
        width = pairs[i].width;
        pairs[i].measure.width = width;
        widthLeft -= width;
        i++;
        itemLeft--;
      }
    }

    // this.measures.forEach(function (measure) {
    //   measure.el.rect(0, 0, measure.width, measure.height)
    //         .attr({ stroke: 'green', fill: 'none' });
    // });

  };

}(musje.Layout, Snap));
