/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var svgPaths = musje.svgPaths;

  // @constructor AccidentalDef
  // SVG definition for accidental
  function AccidentalDef(id, accidental, defs) {
    var
      lo = defs._lo,
      el = this.el = defs._svg.g().attr('id', id),
      accKey = accidental.replace(/bb/, 'b'), // double flat to be synthesized
      pathData = svgPaths[accKey],
      ratio = svgPaths.ACCIDENTAL_RATIOS[accKey],
      shift = svgPaths.ACCIDENTAL_SHIFTS[accKey],
      path = el.path(pathData),
      bb = el.getBBox();

    path.transform(Snap.matrix()
      .translate(0.1 * lo.accidentalShift, -lo.accidentalShift)
      .scale(ratio * lo.accidentalFontSize)
      .translate(-bb.x, shift - bb.y2)
    );

    // Double flat
    if (accidental === 'bb') {
      el.use(path).attr('x', lo.accidentalFontSize * 0.24);
      el.transform('scale(0.9,1)');
    }

    bb = el.getBBox();
    el.toDefs();
    this.width = bb.width * 1.2;
  }

  musje.AccidentalDef = AccidentalDef;

}(musje, Snap));
