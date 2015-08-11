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

  function layoutMeasure(measure, system) {
    var x, width;

    defineProperty(measure, 'width', {
      get: function () {
        return width;
      },
      set: function (w) {
        width = w;
      }
    });

    defineProperty(measure, 'x', {
      get: function () {
        return x;
      },
      set: function (v) {
        x = v;
        measure.el.transform(Snap.matrix().translate(x, 0));
      }
    });

    measure.el = system.el.g().addClass('mus-measure');
    measure.height = system.height;
  }

  System.prototype.layoutMeasures = function () {
    var
      system = this,
      x = 0;

    this.measures.forEach(function (measure) {
      layoutMeasure(measure, system);
    });
    this.tuneMeasuresWidths();
    this.measures.forEach(function (measure) {
      measure.x = x;
      x += measure.width;
    });
  };


  function getPairs(measures) {
    return measures.map(function (measure) {
      return {
        width: measure.minWidth,
        measure: measure
      };
    }).sort(function (a, b) {
      return b.width - a.width;   // descending sort
    });
  }

  System.prototype.tuneMeasuresWidths = function () {
    var
      systemWidth = this.width,
      pairs = getPairs(this.measures),
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
