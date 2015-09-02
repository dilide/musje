/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  /**
   * @class
   * @param {Object} layout - Reference to the parent layout instance.
   */
  musje.Layout.Content = function (layout) {
    this._layout = layout;
    this.el = layout.body.el.g().addClass('mus-content');
    this.width = layout.body.width;

    var system = new musje.Layout.System(this, layout.options);
    system.y = 0;
    system.height = 25;
    this.systems = [system];
  };

  musje.defineProperties(musje.Layout.Content.prototype,
  /** @lends musje.Layout.Content# */
  {
    _resizeBody: function () {
      var
        layout = this._layout,
        headerHeight = layout.header.height;

      layout.body.height = this.height +
              (headerHeight ? headerHeight + layout.options.headerSep : 0);
    },

    /**
     * Divide measures in timewise score into the systems.
     * Assign `y`, `height`, `minWdith`, and `measures` to each system.
     * @param scoreMeasure {musje.TimewiseMeasures} The timewise score measure.
     */
    flow: function (scoreMeasures) {
      var
        content = this,
        lo = this._layout.options,
        systems = this.systems,
        system = systems[0],
        width = content.width,
        height = 25,
        s = 0,
        x = 0;

      function y() {
        return s * (height + lo.systemSep);
      }

      scoreMeasures.forEach(function (measure) {
        var notCellWidth = (measure.barLeftInSystem.width + measure.barRightInSystem.width) / 2 + lo.measurePaddingLeft + lo.measurePaddingRight;
        x += measure.minWidth + notCellWidth;

        // Continue putting this measure in the system.
        if (x < width) {
          system.measures.push(measure);
          x += lo.measurePaddingLeft;

        // New system
        } else {
          s++;
          system = systems[s] = new musje.Layout.System(content, lo);
          system.y = y();
          system.height = height;
          system.measures.push(measure);
          x = measure.minWidth + notCellWidth;
        }
      });

      s++;
      content.height = y() + height;

      systems.forEach(function (system) {
        system.flow();
      });
    },

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
        return this._h;
      },
      set: function (h) {
        this._h = h;
        this._resizeBody();
      }
    }

  });

}(musje, Snap));
