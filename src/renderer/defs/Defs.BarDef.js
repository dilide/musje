/* global musje */

(function (Defs) {
  'use strict';

  // @constructor BarDef
  // SVG definition for barline.
  var BarDef = Defs.BarDef = function (id, bar, layout) {
    var
      lo = layout.options,
      x = 0,
      lineWidth;

    this.el = layout.svg.el.g().attr('id', id).toDefs();

    switch (bar.value) {
    case 'single':
      lineWidth = lo.thinBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth;
      break;
    case 'double':
      lineWidth = lo.thinBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineSep;
      this._addBarline(x, lineWidth);
      x += lineWidth;
      break;
    case 'end':
      lineWidth = lo.thinBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineSep;
      lineWidth = lo.thickBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth;
      break;
    case 'repeat-begin':
      lineWidth = lo.thickBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineSep;
      lineWidth = lo.thinBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineDotSep + lo.barlineDotRadius;
      break;
    case 'repeat-end':
      x = lo.barlineDotSep + lo.barlineDotRadius;
      lineWidth = lo.thinBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineSep;
      lineWidth = lo.thickBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth;
      break;
    case 'repeat-both':
      x = lo.barlineDotSep + lo.barlineDotRadius;
      lineWidth = lo.thinBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineSep;
      lineWidth = lo.thickBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineSep;
      lineWidth = lo.thinBarlineWidth;
      this._addBarline(x, lineWidth);
      x += lineWidth + lo.barlineDotSep + lo.barlineDotRadius;
      break;
    }

    this.width = x;
  };

  BarDef.prototype._addBarline = function (x, width) {
    this.el.rect(x, 0, width, 1);
  };

}(musje.Defs));
