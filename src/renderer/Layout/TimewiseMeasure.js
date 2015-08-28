/* global musje, Snap */

(function (TimewiseMeasurePrototype, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  TimewiseMeasurePrototype.calcMinWidth = function () {
    var lo = this.layout.options, minWidth = 0;

    this.parts.forEach(function (cell) {
      minWidth = Math.max(minWidth, cell.minWidth);
    });

    this._padding = lo.measurePaddingLeft + lo.measurePaddingRight;
    this.minWidth = minWidth + this._padding;
  };

  TimewiseMeasurePrototype.flow = function () {
    var measure = this;
    measure.parts = measure.parts.map(function (cell) {
      cell.measure = measure;
      cell._x = measure.barLeft.width / 2 +
                measure.layout.options.measurePaddingRight;

      cell.y2 = measure.system.height;

      // cell.el.rect(0, -cell.height, cell.width, cell.height)
      //   .addClass('bbox');

      return cell;
    });
  };

  defineProperty(TimewiseMeasurePrototype, 'system', {
    get: function () {
      return this._s;
    },
    set: function (system) {
      this._s = system;
      this.el = system.el.g().addClass('mus-measure');
      this.height = system.height;
    }
  });

  defineProperty(TimewiseMeasurePrototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
      var padding = this._padding;
      this.parts.forEach(function (cell) {
        cell.width = w - padding;
      });
    }
  });

  defineProperty(TimewiseMeasurePrototype, 'x', {
    get: function () {
      return this._x;
    },
    set: function (x) {
      this._x = x;
      this.el.transform(Snap.matrix().translate(x, 0));
    }
  });

  defineProperty(TimewiseMeasurePrototype, 'barLeft', {

    // barLeft at first measure of a system:
    // |]  -> |
    // :|  -> |
    // :|: -> |:
    get: function () {
      var bar = this._bl;
      if (!bar) { return { width: 0, height: 0 }; }

      if (this.index === 0) {
        if (bar.value === 'end' || bar.value === 'repeat-end') {
          bar = new musje.Bar('single');
        } else if (bar.value === 'repeat-both') {
          bar = new musje.Bar('repeat-begin');
        }
      }
      bar.def = this.layout.defs.get(bar);
      return bar;
    },

    set: function (bar) {
      this._bl = bar;
    }
  });

  defineProperty(TimewiseMeasurePrototype, 'barRight', {

    // barRight at last measure of a system:
    //  |: ->  |
    // :|: -> :|
    get: function () {
      if (!this.layout) { return this._br; }

      var bar = this._br, system = this.system;
      if (!bar) { return { width: 0, height: 0 }; }

      if (system && this.index === system.measures.length - 1) {
        if (bar.value === 'repeat-begin') {
          bar = new musje.Bar('single');
        } else if (bar.value === 'repeat-both') {
          bar = new musje.Bar('repeat-end');
        }
      }
      bar.def = this.layout.defs.get(bar);
      return bar;
    },

    set: function (bar) {
      this._br = bar;
    }
  });

}(musje.TimewiseMeasure.prototype, Snap));
