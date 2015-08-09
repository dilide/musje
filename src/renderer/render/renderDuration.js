/*global musje, Snap*/

(function (musje, Snap) {
  'use strict';

  function findEndBeamedNote(cell, begin, beamLevel) {
    var i = begin + 1,
      next = cell[i];
    while (next && next.beams && next.beams[beamLevel] !== 'end') {
      i++;
      next = cell[i];
    }
    return next;
  }

  function endX(note) {
    var def = note.def;
    return note.pos.x + def.pitchDef.width +
           def.durationDef.width * def.pitchDef.matrix.split().scalex;
  }

  function renderUnderbar(note, x, y, cell, lo) {
    cell.el.line(x, y, endX(note), y)
           .attr('stroke-width', lo.typeStrokeWidth);
  }

  function renderDuration(note, noteIdx, cell, lo) {
    var durationDef = note.def.durationDef;
    var pitchDef = note.def.pitchDef;

    var underbar = note.duration.underbar;
    var x = note.pos.x;
    var y = note.pos.y;

    // Whole and half notes
    if (note.duration.type < 4) {
      cell.el.use(durationDef.el).attr({
        x: x + pitchDef.width,
        y: y + pitchDef.stepCy
      });
    } else {
      // Dots for quarter or shorter notes
      if (note.duration.dot) {
        cell.el.g().transform(Snap.matrix().translate(x + pitchDef.width, y))
          .use(durationDef.el).transform(pitchDef.matrix);
      }
      // Eigth or shorter notes
      if (underbar) {
        for (var i = 0; i < underbar; i++) {
          if (note.beams && note.beams[i]) {
            if (note.beams[i] === 'begin') {
              renderUnderbar(findEndBeamedNote(cell, noteIdx, i), x, y, cell, lo);
            }
          } else {
            renderUnderbar(note, x, y, cell, lo);
          }
          y -= lo.underbarSep;
        }
      }
    }
  }

  musje.renderDuration = renderDuration;

}(musje, Snap));
