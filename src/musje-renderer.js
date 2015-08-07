/*global Snap*/

var musje = musje || {};

(function (Snap) {
  'use strict';

  function renderDuration(cellEl, note, lo) {
    var durationDef = note.def.durationDef;
    var pitchDef = note.def.pitchDef;

    var underbar = note.duration.underbar;
    var durationWidth = durationDef.width;
    var x = note.pos.x + pitchDef.width;

    // Whole and half notes
    if (note.duration.type < 4) {
      cellEl.use(durationDef.el).attr({
        x: x,
        y: note.pos.y + pitchDef.stepCy
      });
    } else {
      // Dots for quarter or shorter notes
      if (note.duration.dot) {
        cellEl.g().transform(Snap.matrix().translate(x, note.pos.y))
          .use(durationDef.el).transform(pitchDef.matrix);
      }
      // Eigth or shorter notes
      if (underbar) {
        var y = note.pos.y, x0 = x - pitchDef.width;
        durationWidth = durationDef.width * pitchDef.matrix.split().scalex;
        for (var i = 0; i < underbar; i++) {
          cellEl.line(x0, y, x + durationWidth, y)
            .attr('stroke-width', lo.typeStrokeWidth);
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
    var systems = this.layout(svg, lo);

    systems.forEach(function (system) {
      system.measures.forEach(function (measure) {
        measure.parts.forEach(function (cell) {
          cell.forEach(function (data) {
            switch (data.__name__) {
            case 'rest':  // fall through
            case 'note':
              data.el = cell.el.use(data.def.pitchDef.el).attr(data.pos);
              // drawMusicDataBolder(data.el, data.def);
              renderDuration(cell.el, data, lo);
              break;
            case 'time':
              data.el = cell.el.use(data.def.el).attr(data.pos);
              // drawMusicDataBolder(data.el, data.def);
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

}(Snap));
