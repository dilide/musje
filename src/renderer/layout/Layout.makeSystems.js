/* global musje, Snap */

(function (Layout) {
  'use strict';


  Layout.prototype.makeSystems = function () {
    var
      lo = this._lo,
      content = this.content,
      width = content.width,
      height = 25,
      system = new Layout.System(content, lo),
      systems = this.systems = [system],
      i = 0,
      x = 0;

    function y() {
      return i * (height + lo.systemSep);
    }

    system.y = y();
    system.height = height;

    this._score.measures.forEach(function (measure) {
      x += measure.minWidth + lo.measurePaddingRight;
      if (x < width) {
        system.measures.push(measure);
        system.minWidth = x;
        x += lo.measurePaddingLeft;
      } else {
        x = measure.minWidth + lo.measurePaddingRight;
        i++;
        system = systems[i] = new Layout.System(content, lo);
        system.y = y();
        system.height = height;
        system.measures.push(measure);
      }
    });

    this.content.height = y() + height;

  };

}(musje.Layout, Snap));
