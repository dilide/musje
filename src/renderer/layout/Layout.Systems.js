/* global musje */

(function (Layout) {
  'use strict';

  var Systems = Layout.Systems = function (score, content, lo) {
    this._score = score;
    this._content = content;
    this._lo = lo;
    this.width = content.width;
    this.height = 25;
  };

  // Divide measures in timewise score into the systems.
  // Assign y, height, minWdith, and measures to each system.
  Systems.prototype.flow = function () {
    var
      content = this._content,
      lo = this._lo,
      width = this.width,
      height = this.height,
      i = 0,
      x = 0,
      system,
      result;

    function y() {
      return i * (height + lo.systemSep);
    }

    system = new Layout.System(content, lo);
    system.y = 0;
    system.height = height;
    result = this._value = [system];

    this._score.measures.forEach(function (measure) {
      x += measure.minWidth + lo.measurePaddingRight;
      if (x < width) {
        system.measures.push(new Layout.Measure(measure, system, lo));
        system.minWidth = x;
        x += lo.measurePaddingLeft;
      } else {
        x = measure.minWidth + lo.measurePaddingRight;
        i++;
        system = result[i] = new Layout.System(content, lo);
        system.y = y();
        system.height = height;
        system.measures.push(new Layout.Measure(measure, system, lo));
      }
    });

    content.height = y() + height;

    this._value.forEach(function (system) {
      system.measures.flow();
    });

  };

  Systems.prototype.forEach = function (callback) {
    this._value.forEach(callback);
  };

}(musje.Layout));
