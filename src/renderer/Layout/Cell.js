/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  musje.defineProperties(musje.Cell.prototype,
  /** @lends  musje.Cell.prototype */
  {

    /**
     * Flow the cell.
     */
    flow: function () {
      var
        defs = this.layout.defs,
        lo = this.layout.options,
        x = 0,
        minHeight;

      this.data.forEach(function (data) {
        var def = data.def = defs.get(data);
        data.x = x;
        data.y = 0;
        x += def.width + lo.musicDataSep;
        minHeight = Math.min(minHeight, def.height);
      });

      this.minWidth = x;
      this.minHeight = minHeight;
    },

    /**
     * @protected
     */
    _reflow: function () {
      var cell = this;
      this.data.forEach(function (data) {
        data.x *= cell.width / cell.minWidth;
      });
    },

    /**
     * Width
     * - (Getter) Get the cell width.
     * - (Setter) Set the cell width, and this will cause the cell to reflow (`this._reflow()` will be called).
     * @type {number}
     */
    width: {
      get: function () {
        return this._w;
      },
      set: function (w) {
        this._w = w;
        this._reflow();
      }
    },

    /**
     * X
     * @type {number}
     */
    x: {
      get: function () {
        return this._x;
      },
      set: function (x) {
        this._x = x;
        this.el.transform(Snap.matrix().translate(x, this.y2));
      }
    },

    /**
     * Y2
     * @type {number}
     */
    y2: {
      get: function () {
        return this._y2;
      },
      set: function (y2) {
        this._y2 = y2;
        this.el.transform(Snap.matrix().translate(this.x, y2));
      }
    },

    barLeft: {

      // barLeft at first measure of a system:
      // |]  -> |
      // :|  -> |
      // :|: -> |:
      get: function () {
        var bar = this._bl;
        if (!bar) { return { width: 0, height: 0 }; }

        // First measure in the system.
        if (this.measure.systemIndex === 0) {
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
    },

    barRight: {

      // barRight at last measure of a system:
      //  |: ->  |
      // :|: -> :|
      get: function () {
        if (!this.layout) { return this._br; }

        var
          bar = this._br,
          system = this.measure.system;

        if (!bar) { return { width: 0, height: 0 }; }

        // Last measure in the system.
        if (system && this.measure.systemIndex === system.measures.length - 1) {
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
    }

  });

}(musje, Snap));
