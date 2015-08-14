/* global musje, Snap */

(function (Defs, Snap) {
  'use strict';

  // @constructor TimeDef
  // SVG definition for Time signature.
  Defs.TimeDef = function (id, time, layout) {
    var
      lo = layout.options,
      timeFontSize = lo.timeFontSize,
      lineExtend = timeFontSize * 0.1,
      el = this.el = layout.svg.el.g()
        .attr({
          id: id,
          fontSize: timeFontSize,
          fontWeight: lo.timeFontWeight,
          textAnchor: 'middle'
        }),
      lineY = -0.85 * timeFontSize,
      bb;

    el.text(0, -1 * timeFontSize, time.beats);
    el.text(0, 0, time.beatType);   // baseline y = 0
    bb = el.getBBox();
    el.line(bb.x - lineExtend, lineY, bb.x2 + lineExtend, lineY);
    el.transform(Snap.matrix().scale(1, 0.8).translate(lineExtend - bb.x, 0));

    bb = el.getBBox();
    el.toDefs();

    this.width = bb.width;
    this.height = -bb.y;
  };

}(musje.Defs, Snap));
