/*global musje, Snap*/

(function (musje, Snap) {
  'use strict';

  // @constructor TimeDef
  // SVG definition for Time signature.
  function TimeDef(svg, id, time, lo) {
    var
      timeFontSize = lo.timeFontSize,
      lineExtend = timeFontSize * 0.1,
      el = svg.g(
          svg.text(0, -1 * timeFontSize, time.beats),
          svg.text(0, 0, time.beatType)   // baseline y = 0
        )
        .attr({
          id: id,
          fontSize: timeFontSize,
          fontWeight: lo.timeFontWeight,
          textAnchor: 'middle'
        }),
      bb = el.getBBox(),
      lineY = -0.85 * timeFontSize;

    el.line(bb.x - lineExtend, lineY, bb.x2 + lineExtend, lineY);
    el.transform(Snap.matrix().scale(1, 0.8).translate(lineExtend - bb.x, 0));
    bb = el.getBBox();
    el.toDefs();

    return {
      el: el,
      width: bb.width,
      height: -bb.y
    };
  }

  musje.TimeDef = TimeDef;

}(musje, Snap));
