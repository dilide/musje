/*global musje*/

(function (musje) {
  'use strict';

  var renderDuration = musje.renderDuration;

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
              renderDuration(data, dataIdx, cell, lo);
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

}(musje));
