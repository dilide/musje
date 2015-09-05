/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  /**
   * @class
   * @param layout {musje.Layout}
   */
  musje.Layout.Svg = function (layout) {
    this._layout = layout;
    var lo = layout.options;

    this.el = Snap(layout.svg).attr({
        fontFamily: lo.fontFamily
      }).addClass('musje');
    this.el.clear();

    this.width = lo.width;
  };

  musje.defineProperties(musje.Layout.Svg.prototype,
  /** @lends musje.Layout.Svg# */
  {
    /**
     * Width of the svg.
     * @type {number}
     */
    width: {
      get: function () {
        return this._w;
      },
      set: function (w) {
        this._w = w;
        this.el.attr('width', w);
        var body = this._layout.body;
        if (body) { body.width = w; }
      }
    },

    /**
     * Height of the svg.
     * @type {number}
     */
    height: {
      get: function () {
        return this._h;
      },
      set: function (h) {
        this._h = h;
        this.el.attr('height', h);
      }
    }
  });

}(musje.Layout, Snap));
