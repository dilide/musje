/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  /**
   * @class
   * @param {Object} layout - Reference to the parent layout instance.
   */
  musje.Layout.Content = function (layout) {
    this.layout = layout;
    this.el = layout.body.el.g().addClass('mus-content');
    this.width = layout.body.width;
  };

  musje.defineProperties(musje.Layout.Content.prototype,
  /** @lends musje.Layout.Content# */
  {

    y: {
      get: function () {
        return this._y;
      },
      set: function (y) {
        this._y = y;
        this.el.transform(Snap.matrix().translate(0, y));
        this._resizeBody();
      }
    },

    width: {
      get: function () {
        return this._w;
      },
      set: function (w) {
        this._w = w;
      }
    },

    height: {
      get: function () {
        var last = this.systems[this.systems.length - 1];
        return last ? last.y + last.height : 0;
      }
    },

    _resizeBody: function () {
      var layout = this.layout, hHeight = layout.header.height;

      layout.body.height = this.height +
            (hHeight ? hHeight + layout.options.headerSep : 0);
    },

    /**
     * Divide measures in timewise score into the systems.
     * @param scoreMeasure {musje.TimewiseMeasures} The timewise score measure.
     * @protected
     */
    _makeSystems: function (scoreMeasures) {
      var
        content = this,
        layout = this.layout,
        lo = layout.options,
        measurePadding = lo.measurePaddingLeft + lo.measurePaddingRight,
        system = new musje.Layout.System(layout, 0),
        systems = this.systems = [system];

      scoreMeasures.forEach(function (measure) {
        var minWidth = measure.minWidth + measurePadding +
                      (measure.barLeftInSystem.width +
                       measure.barRightInSystem.width) / 2;

        // Continue put this measure in the system.
        if (system.minWidth + minWidth < content.width) {
          system.measures.push(measure);

        // New system
        } else {
          system = new musje.Layout.System(layout, systems.length);
          systems.push(system);
          system.measures.push(measure);
        }
      });
    },

    _maxLengthSystem: {
      get:function () {
        var maxLength = 0, i, system;

        this.systems.forEach(function (system) {
          maxLength = Math.max(maxLength, system.measures.length);
        });

        // Find the first max length system backward.
        for(i = this.systems.length - 1; i >= 0; i--) {
          system = this.systems[i];
          if (system.measures.length === maxLength) { return system; }
        }
      }
    },

    _isNotBalancable: {
      get: function () {
        var
          systems = this.systems,
          len = systems.length;

        return len === 1 ||
              (len === 2 && systems[1].minWidth < this.width * 0.4);
      }
    },

    _balanceSystems: function () {
      if (this._isNotBalancable) { return; }

      var
        systems = this.systems,
        last = systems[systems.length - 1],
        system = this._maxLengthSystem,
        next, prev;

      // Move measures down to balance the last system.
      while (last.measures.length < system.measures.length - 1) {

        // Move a measure tail-to-head downward to the last measure.
        while (true) {
          next = system.next;
          if (!next) { break; }
          next.measures.unshift(system.measures.pop());
          system = next;
        }
        system = this._maxLengthSystem;
      }

      // Move back measures if the system exceeds the content width.
      system = last;
      while (system) {
        prev = system.prev;
        while (system.minWidth > this.width) {
          prev.measures.push(system.measures.shift());
        }
        system = prev;
      }
    },

    /**
     * @param scoreMeasure {musje.TimewiseMeasures} The timewise score measure.
     */
    flow: function (scoreMeasures) {
      this._makeSystems(scoreMeasures);
      this._balanceSystems();
      this.systems.forEach(function (system) { system.flow(); });
    }
  });

}(musje, Snap));
