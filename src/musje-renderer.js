/*global Snap*/

var musje = musje || {};

(function (Snap) {
  'use strict';

  var
    objExtend = musje.objExtend;

  function near(a, b, epsilon) {
    epsilon = epsilon || 0.00001;
    return Math.abs(a - b) < epsilon;
  }

  function prepareTimewise(score) {
    var measures = score.measures = [];
    score.walkCells(function (cell, measureIdx, partIdx) {
      measures[measureIdx] = measures[measureIdx] || [];
      var measure = measures[measureIdx];
      measure.parts = measure.parts || [];
      measure.parts[partIdx] = cell;
    });
  }

  // =====================================================================

  function findBeamGroup(cell, groupDur) {
    var counter = 0, group = [], groups = [];

    function inGroup() {
      return counter < groupDur && !near(counter, groupDur);
    }
    function putGroup() {
      if (group.length > 1) { groups.push(group); }
      group = [];
    }

    cell.forEach(function (musicData) {
      if (musicData.__name__ !== 'note' && musicData.__name__ !== 'rest') {
        return;
      }
      var
        duration = musicData.duration,
        dur = duration.quarter;

      counter += dur;

      if (inGroup()) {
        if (duration.underbar) { group.push(musicData); }
      } else if (near(counter, groupDur)) {
        group.push(musicData);
        putGroup();
        counter = 0;
      } else {
        putGroup();
        counter %= groupDur;
      }
    });
    putGroup();

    return groups;
  }

  // @param cell {Array} either a measure in a part, or a part in a measure.
  // @param groupDur {number} Duration of a beam group in quarter.
  function makeBeam(cell, groupDur) {

    findBeamGroup(cell, groupDur).forEach(function (group) {
      var beamLevel = {};

      function hasNeighborUnderbar(index, underbar) {
        return group[index] && group[index].duration.underbar >= underbar;
      }

      group.forEach(function(musicData, g) {
        var
          underbar = musicData.duration.underbar,
          i;
        for (i = 1; i <= underbar; i++) {
          if (hasNeighborUnderbar(g + 1, i)) {
            musicData.beam = musicData.beam || {};
            if (beamLevel[i]) {
              musicData.beam[i] = 'continue';
            } else {
              beamLevel[i] = true;
              musicData.beam[i] = 'begin';
            }
          } else {
            if (beamLevel[i]) {
              musicData.beam = musicData.beam || {};
              musicData.beam[i] = 'end';
              delete beamLevel[i];
            }
          }
        }
      });
    });
  }

  // ======================================================================

  function makeSvg(svg, lo) {
    svg = Snap(svg).attr({
      fontFamily: lo.fontFamily,
      width: lo.width,
      height: lo.height
    });
    svg.clear();
    return svg;
  }

  function makeBody(svg, lo) {
    return {
      el: svg.g()
          .transform(Snap.matrix().translate(lo.marginLeft, lo.marginTop))
          .addClass('mus-body'),
      width: lo.width - lo.marginLeft - lo.marginRight,
      height: lo.height - lo.marginTop - lo.marginBottom
    };
  }

  function renderHeader(score, body, lo) {
    var el = body.el.g().addClass('mus-header');

    el.text(body.width / 2, lo.titleFontSize, score.head.title)
      .attr({
        fontSize: lo.titleFontSize,
        fontWeight: lo.titleFontWeight,
        textAnchor: 'middle'
      });
    el.text(body.width, lo.titleFontSize * 1.5, score.head.composer)
      .attr({
        fontSize: lo.composerFontSize,
        fontWeight: lo.composerFontWeight,
        textAnchor: 'end'
      });

    return {
      el: el,
      width: body.width,
      height: el.getBBox().height
    };
  }

  function makeContent(body, header, lo) {
    var yOffset = header.height + lo.headerSep;
    return {
      el: body.el.g()
          .transform(Snap.matrix().translate(0, yOffset))
          .addClass('mus-content'),
      width: body.width,
      height: body.height - yOffset
    };
  }

  function makeSystems(score, content, lo) {
    var systems = [];
    var system;
    var i = 0;
    var systemX = 0;
    score.walkCells(function (cell) {
      if (!systems[i]) {
        system = systems[i] = [];
        system.width = content.width;
        system.height = 40;
        system.el = layoutSystem(content, i, system.height, lo);
      }
      systems[i].push(cell);
      systemX += cell.minWidth;
      system.minWidth = systemX;
      if (systemX >= content.width) {
        systemX = 0;
        i++;
      }
    });
    systems.forEach(function (system) {
      layoutCells(system, lo);
      system.forEach(function (cell) {
        var x = 0;
        cell.forEach(function (data) {
          switch (data.__name__) {
          case 'rest':  // fall through
          case 'note':
            data.pos = { x: x, y: 0 };
            x += data.def.width + lo.musicDataSep;
            break;
          case 'time':
            data.pos = { x: x, y: 0 };
            x += data.def.width + lo.musicDataSep;
            break;
          case 'bar':
            x += lo.measurePaddingRight - lo.musicDataSep;
            data.pos = { x: x, y: 0 };
            data.def = { height: 25 };
            x += lo.measurePaddingLeft;
            break;
          }
        });
      });
    });
    return systems;
  }

  function setMusicDataDef(score, svg, lo) {
    var defs = new musje.Defs(svg, lo);

    score.walkCells(function (cell) {
      makeBeam(cell, 1);
    });

    score.walkMusicData(function (data) {
      switch (data.__name__) {
      case 'rest':  // fall through
      case 'note':
        data.def = defs.get(data);
        break;
      case 'time':
        data.def = defs.get(data);
        break;
      case 'bar':
        // break;
      default:
        data.def = { width: 0, height: 0 };
      }
    });
  }

  function setCellDimension(cell, lo) {
    var x = 0, minHeight;
    cell.forEach(function (musicData) {
      x += musicData.def.width + lo.musicDataSep;
      minHeight = Math.min(minHeight, musicData.def.height);
    });
    objExtend(cell, {
      minWidth: x,
      minHeight: minHeight
    });
  }

  function layoutSystem(content, systemIndex, height, lo) {
    var yOffset = (systemIndex + 1) * height + systemIndex * lo.systemSep;
    return content.el.g()
        .transform(Snap.matrix().translate(0, yOffset))
        .addClass('mus-system');
  }

  function layoutCells(system) {
    var
      xOffset = 0,
      ratio = system.width / system.minWidth,
      width;
    system.forEach(function (cell) {
      cell.el = system.el.g()
        .transform(Snap.matrix().translate(xOffset, 0))
        .addClass('mus-cell');
      cell.height = system.height;
      width = cell.width = cell.minWidth * ratio;
      xOffset += width;

      cell.el.rect(0, -cell.height, cell.width, cell.height)
        .addClass('bbox');
    });
  }

  function layout(score, svg, lo) {
    prepareTimewise(score);
    lo = objExtend(musje.layoutOptions, lo);
    svg = makeSvg(svg, lo);

    var
      body = makeBody(svg, lo),
      header = renderHeader(score, body, lo),
      content = makeContent(body, header, lo);

    setMusicDataDef(score, svg, lo);
    score.walkCells(function (cell) {
      setCellDimension(cell, lo);
    });

    return makeSystems(score, content, lo);
  }

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

  musje.render = function (score, svg, lo) {
    var systems = layout(score, svg, lo);

    systems.forEach(function (system) {
      system.forEach(function (cell) {
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
  };

}(Snap));
