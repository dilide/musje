/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  /**
   * Body
   * @class
   * @param {musje.Layout} layout
   */
  musje.Layout.Body = function (layout) {
    this._layout = layout;
    var
      svg = layout.svg,
      lo = layout.options;

    this.el = svg.el.g()
        .transform(Snap.matrix().translate(lo.marginLeft, lo.marginTop))
        .addClass('mus-body');
    this.width = lo.width - lo.marginLeft - lo.marginRight;
  };

  musje.defineProperties(musje.Layout.Body.prototype,
  /** @lends musje.Layout.Body.prototype */
  {
    /**
     * Width of the body.
     * - (Getter) Get the body width.
     * - (Setter) Set the body width and this also induces setting the
     * header and content width if one exists.
     * @type {number}
     */
    width: {
      get: function () {
        return this._w;
      },
      set: function (w) {
        this._w = w;
        var layout = this._layout;
        if (layout.header) { layout.header.width = w; }
        if (layout.content) { layout.content.width = w; }
      }
    },

    /**
     * Height of the body.
     * - (Getter) Get the body height.
     * - (Setter) Set the body height and this will also cause the height of svg to vary.
     * @type {number}
     */
    height: {
      get: function () {
        return this._h;
      },
      set: function (h) {
        var layout = this._layout, lo = layout.options;
        layout.svg.height = h + lo.marginTop + lo.marginBottom;
        this._h = h;
      }
    }
  });

}(musje, Snap));
