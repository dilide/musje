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

  function renderDuration(cell, note, noteIdx, lo) {
    var durationDef = note.def.durationDef;
    var pitchDef = note.def.pitchDef;

    var underbar = note.duration.underbar;
    var x = note.pos.x;
    var y = note.pos.y;

    function renderUnderbar(note) {
      cell.el.line(x, y, endX(note), y)
        .attr('stroke-width', lo.typeStrokeWidth);
    }

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
              renderUnderbar(findEndBeamedNote(cell, noteIdx, i));
            }
          } else {
            renderUnderbar(note);
          }
          y -= lo.underbarSep;
        }
      }
    }
  }

  function renderBar(systemEl, bar, lo) {
    // var
    //   x = bar.pos.x,
    //   y = bar.pos.y,
    //   y2 = y - bar.def.height;

    // switch (bar.value) {
    // case 'single':
    //   x += lo.thinBarlineWidth / 2;
    //   systemEl.line(x, y2, x, y)
    //     .attr({ strokeWidth: lo.thinBarlineWidth });
    //   x += lo.thinBarlineWidth / 2;
    //   break;
    // case 'end':
    //   x += lo.thinBarlineWidth / 2;
    //   systemEl.line(x, y2, x, y)
    //     .attr({ strokeWidth: lo.thinBarlineWidth });
    //   x += lo.thinBarlineWidth / 2 + lo.barlineSep +
    //        lo.thickBarlineWidth / 2;
    //   systemEl.line(x, y2, x, y)
    //     .attr({ strokeWidth: lo.thickBarlineWidth });
    //   x += lo.thickBarlineWidth / 2;
    //   break;
    // }
  }

  musje.Score.prototype.render = function (svg, lo) {
    lo = musje.objExtend(musje.layoutOptions, lo);
    var systems = this.layout(svg, lo);

    systems.forEach(function (system) {
      system.measures.forEach(function (measure) {
        measure.parts.forEach(function (cell) {
          cell.forEach(function (data, dataIdx) {
            switch (data.__name__) {
            case 'rest':  // fall through
            case 'note':
              data.el = cell.el.use(data.def.pitchDef.el).attr(data.pos);
              renderDuration(cell, data, dataIdx, lo);
              break;
            case 'time':
              data.el = cell.el.use(data.def.el).attr(data.pos);
              break;
            case 'bar':
              renderBar(cell.el, data, lo);
              break;
            }
          });
        });
      });
    });
  };

}(musje, Snap));
