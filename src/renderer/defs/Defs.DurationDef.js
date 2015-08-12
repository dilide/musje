/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var objExtend = musje.objExtend;

  // @constructor DurationDef
  // SVG Definition for duration.
  var DurationDef = musje.Defs.DurationDef = function (svg, id, duration, lo) {
    this._svg = svg;
    this._lo = lo;

    // only make def el for:
    // id = d10, d11, d12, d20, d21, d20, d41, d40
    switch (duration.type) {
    case 1:   // whole note
      return this._makeType1(id, duration.dot);
    case 2:   // half note
      return this._makeType2(id, duration.dot);
    default:  // other note types type quarter note def
      return this._makeType4(id, duration.dot);
    }
  };

  DurationDef.prototype._addDot = function (el, x, dot, type) {
    var lo = this._lo;

    if (dot > 0) {
      x += lo.dotOffset * (type === 1 ? 1.2 : 1);
      el.circle(x, 0, lo.dotRadius);
    }
    if (dot > 1) {
      x += lo.dotSep * (type === 1 ? 1.2 : 1);
      el.circle(x, 0, lo.dotRadius);
    }
    return x + lo.typebarExt;
  };

  DurationDef.prototype._makeType1 = function (id, dot) {
    var
      lo = this._lo,
      el = this._svg.g().attr('id', id).toDefs(),
      width;

    el.path(Snap.format('M{off},0h{w}m{sep},0h{w}m{sep},0h{w}', {
      off: lo.typebarOffset,
      w: lo.typebarLength,
      sep: lo.typebarSep
    })).attr({
      stroke: 'black',
      strokeWidth: lo.typeStrokeWidth,
      fill: 'none'
    });

    width = this._addDot(el, lo.typebarOffset + 3 * lo.typebarLength +
                             2 * lo.typebarSep, dot, 2);

    return objExtend(this, {
      el: el,
      width: width,
      minWidth: width,
      maxWidth: width
    });
  };

  DurationDef.prototype._makeType2 = function (id, dot) {
    var
      lo = this._lo,
      el = this._svg.g().attr('id', id).toDefs(),
      x = lo.typebarOffset + lo.typebarLength,
      width;

    el.line(lo.typebarOffset, 0, x, 0)
      .attr('stroke-width', lo.typeStrokeWidth);

    width = this._addDot(el, x, dot, 2);

    return objExtend({
      el: el,
      width: width,
      minWidth: width,
      maxWidth: width
    });
  };

  DurationDef.prototype._makeType4 = function (id, dot) {
    if (dot === 0) { return objExtend(this, { width: 0 }); }

    var
      lo = this._lo,
      el = this._svg.g().attr('id', id).toDefs(),
      x = lo.t4DotOffset;

    el.circle(x += lo.t4DotOffset, -lo.t4DotBaselineShift, lo.dotRadius);
    if (dot > 1) {
      el.circle(x += lo.t4DotSep, -lo.t4DotBaselineShift, lo.dotRadius);
    }
    return objExtend(this, { el: el, width: x + lo.t4DotExt });
  };

}(musje, Snap));
