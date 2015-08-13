/* global musje */

(function (Layout) {
  'use strict';

  var Systems = Layout.Content.Systems = function (content, lo) {
    this._content = content;
    this._lo = lo;

    var system = new Layout.System(content, lo);
    system.y = 0;
    system.height = 25;
    this._value = [system];
  };

  // Divide measures in timewise score into the systems.
  // Assign y, height, minWdith, and measures to each system.
  Systems.prototype.flow = function (scoreMeasures) {
    var
      content = this._content,
      lo = this._lo,
      result = this._value,
      system = result[0],
      width = content.width,
      height = 25,
      s = 0,
      x = 0;

    function y() {
      return s * (height + lo.systemSep);
    }

    scoreMeasures.forEach(function (measure) {
      x += measure.minWidth + lo.measurePaddingRight;

      // Continue putting this measure in the system.
      if (x < width) {
        measure = new Layout.Measure(measure, system, lo);
        system.measures.push(measure);
        system.minWidth = x;
        x += lo.measurePaddingLeft;

      // New system
      } else {
        s++;
        system = result[s] = new Layout.System(content, lo);
        system.y = y();
        system.height = height;
        measure = new Layout.Measure(measure, system, lo);
        system.measures.push(measure);
        x = measure.minWidth + lo.measurePaddingRight;
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
