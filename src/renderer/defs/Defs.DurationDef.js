/* global musje, Snap */

(function (Defs, Snap) {
  'use strict';

  // @constructor DurationDef
  // SVG Definition for duration.
  var DurationDef = Defs.DurationDef = function (id, duration, layout) {
    this._id = id;
    this._layout = layout;

    // only make def el for:
    // id = d10, d11, d12, d20, d21, d20, d41, d40
    switch (duration.type) {
    case 1:   // whole note
      this._makeEl();
      this._makeType1(id, duration.dot);
      break;
    case 2:   // half note
      this._makeEl();
      this._makeType2(id, duration.dot);
      break;
    default:  // other note types type quarter note def
      if (duration.dot === 0) {
        this.width = 0 ;
      } else {
        this._makeEl();
        this._makeType4(id, duration.dot);
      }
    }
  };

  DurationDef.prototype._makeEl = function () {
    this.el = this._layout.svg.el.g()
                .attr('id', this._id)
                .toDefs();
  };

  // Add dot for type 1 (whole) or type 2 (half) note.
  DurationDef.prototype._addDot = function (x, dot, type) {
    var lo = this._layout.options;

    if (dot > 0) {
      x += lo.dotOffset * (type === 1 ? 1.2 : 1);
      this.el.circle(x, 0, lo.dotRadius);
    }
    if (dot > 1) {
      x += lo.dotSep * (type === 1 ? 1.2 : 1);
      this.el.circle(x, 0, lo.dotRadius);
    }
    return x + lo.typebarExt;
  };

  DurationDef.prototype._makeType1 = function (id, dot) {
    var
      lo = this._layout.options,
      x = lo.typebarOffset;

    this._addLine(x);
    x += lo.typebarLength + lo.typebarSep;
    this._addLine(x);
    x += lo.typebarLength + lo.typebarSep;
    this._addLine(x);
    x += lo.typebarLength;

    this.width = this._addDot(x, dot, 1);
  };

  DurationDef.prototype._addLine = function (x) {
    var lo = this._layout.options;
    this.el.rect(x, -lo.typeStrokeWidth,
                 lo.typebarLength, lo.typeStrokeWidth);
  };

  DurationDef.prototype._makeType2 = function (id, dot) {
    var
      lo = this._layout.options,
      x = lo.typebarOffset;

    this._addLine(lo.typebarOffset);
    x += lo.typebarLength;
    this.width = this._addDot(x, dot, 2);
  };

  DurationDef.prototype._makeType4 = function (id, dot) {
    var
      lo = this._layout.options,
      x = lo.t4DotOffset;

    this.el.circle(x, -lo.t4DotBaselineShift, lo.dotRadius);
    if (dot > 1) {
      x += lo.t4DotSep;
      this.el.circle(x, -lo.t4DotBaselineShift, lo.dotRadius);
    }
    this.width = x + lo.t4DotExt;
  };

}(musje.Defs, Snap));
