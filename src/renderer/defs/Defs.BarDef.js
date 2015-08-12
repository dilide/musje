/* global musje */

(function (Defs) {
  'use strict';

  // @constructor BarDef
  // SVG definition for barline
  var BarDef = Defs.BarDef = function (svg, bar, defs) {
    var
      lo = this._lo = defs._lo,
      el = this.el = svg.g().attr('id', bar.value),
      bb = el.getBBox(),
      x = 0;
console.log(defs._lo)
    var height = 30;  // testing only

    switch (bar.value) {
    case 'single':
      this._addThinBar(0, height);
      break;
    case 'end':
      this._addThinBar(0, height);
      x += lo.thinBarlineWidth + lo.barlineSep;
      this._addThickbar(x, height);
      break;
    }

    bb = el.getBBox();
    el.toDefs();
    this.width = bb.width * 1.2;
  };

  BarDef.prototype._addThinBar = function (x, height) {
    var lo = this._lo;
    x += lo.thinBarlineWidth / 2;
    this.el.line(x, 0, x, height)
        .attr({ strokeWidth: lo.thinBarlineWidth });
  };

  BarDef.prototype._addThickBar = function (x, height) {
    var lo = this._lo;
    x += lo.thickBarlineWidth / 2;
    this.el.line(x, 0, x, height)
        .attr({ strokeWidth: lo.thickBarlineWidth });
  };

}(musje.Defs));
