/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  function makeSystem(content, systemIndex, height, lo) {
    var yOffset = (systemIndex + 1) * height + systemIndex * lo.systemSep;
    return content.el.g()
        .transform(Snap.matrix().translate(0, yOffset))
        .addClass('mus-system');
  }

  musje.Layout.prototype.makeSystems = function () {
    var
      lo = this._lo,
      content = this.content,
      width = content.width,
      height = 40,
      system = {
        width: width,
        height: height,
        el: makeSystem(content, 0, height, lo),
        measures: []
      },
      systems = this.systems = [system],
      i = 0,
      x = 0;

    this._score.measures.forEach(function (measure) {
      x += measure.minWidth + lo.measurePaddingRight;
      if (x < width) {
        system.measures.push(measure);
        system.minWidth = x;
        x += lo.measurePaddingLeft;
      } else {
        x = measure.minWidth + lo.measurePaddingRight;
        i++;
        system = systems[i] = {
          width: width,
          height: height,
          el: makeSystem(content, i, height, lo),
          measures: [measure]
        };
      }
    });
  };

}(musje, Snap));
