/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var System = Layout.System = function (content, lo) {
    this._lo = lo;
    this.el = content.el.g().addClass('mus-system');
    this.width = content.width;
    this.measures = [];
  };

  defineProperty(System.prototype, 'y', {
    get: function () {
      return this._y;
    },
    set: function (y) {
      this._y = y;
      this.el.transform(Snap.matrix().translate(0, y));
    }
  });

  defineProperty(System.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(System.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
    }
  });

  System.prototype.tuneMeasureWidths = function () {
    var
      systemWidth = this.width,
      pairs = this.measures.map(function (measure) {
          return {
            width: measure.minWidth,
            measure: measure
          };
        }).sort(function (a, b) {
          return b.width - a.width;   // sort descending
        }),
      length = pairs.length,
      itemLeft = length,
      widthLeft = systemWidth,
      i = 0,
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
        pairs[i].measure.width = pairs[i].width;
        widthLeft -= pairs[i].width;
        i++;
        itemLeft--;
      }
    }
  };

}(musje.Layout, Snap));
