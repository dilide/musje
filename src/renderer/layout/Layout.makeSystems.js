/* global musje, Snap */

(function (Layout) {
  'use strict';


  Layout.prototype.makeSystems = function () {
    var
      lo = this._lo,
      content = this.content,
      width = content.width,
      height = 40,
      system = new Layout.System(content, lo),
      systems = this.systems = [system],
      i = 0,
      x = 0;

    function offset() {
      return (i + 1) * height + i * lo.systemSep;
    }

    system.offset = offset();
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
        system.offset = offset();
        system.height = height;
        system.measures.push(measure);
      }
    });

    this.content.height = offset();

  };

}(musje.Layout, Snap));
