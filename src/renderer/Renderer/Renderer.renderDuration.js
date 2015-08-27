/* global musje, Snap */

(function (Renderer, Snap) {
  'use strict';

  function x2(note) {
    var def = note.def;
    return def.pitchDef.width +
           def.durationDef.width * def.pitchDef.scale.x;
  }

  function renderUnderbar(note1, note2, y, lo) {
    note1.el.line(0, y, note2.x - note1.x + x2(note2), y)
           .attr('stroke-width', lo.typeStrokeWidth);
  }

  Renderer.renderDuration = function (note, lo) {
    var durationDef = note.def.durationDef;
    var pitchDef = note.def.pitchDef;

    var underbar = note.duration.underbar;
    var y = 0;

    // Whole and half notes
    if (note.duration.type < 4) {
      note.el.use(durationDef.el).attr({
        x: pitchDef.width,
        y: pitchDef.stepCy
      });

    // Quarter or shorter notes
    } else {

      // Add dots
      if (note.duration.dot) {
        note.el.g().transform(Snap.matrix().translate(pitchDef.width, 0))
          .use(durationDef.el).transform(pitchDef.matrix);
      }

      // Add underbars for eigth or shorter notes
      if (underbar) {
        for (var i = 0; i < underbar; i++) {

          // Only render beam for the begin one.
          if (note.beams && note.beams[i]) {
            if (note.beams[i].value === 'begin') {
              renderUnderbar(note, note.beams[i].endNote(), y, lo);
            }

          // Unbeamed underbar
          } else {
            renderUnderbar(note, note, y, lo);
          }
          y -= lo.underbarSep;
        }
      }
    }
  };

}(musje.Renderer, Snap));
