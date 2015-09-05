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
        return this._h;
      },
      set: function (h) {
        this._h = h;
        this._resizeBody();
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
        var
          minWidth = measure.minWidth + measurePadding +
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

    /**
     * @param scoreMeasure {musje.TimewiseMeasures} The timewise score measure.
     */
    flow: function (scoreMeasures) {

      this._makeSystems(scoreMeasures);

      var
        systemSep = this.layout.options.systemSep,
        height = 0;

      this.systems.forEach(function (system) {
        system.flow();
        height += system.height + systemSep;
      });

      this.height = height ? height - systemSep : 0;
    }
  });

}(musje, Snap));
