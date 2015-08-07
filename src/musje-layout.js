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
    var i = 0;
    var x = 0;
    var height = 40;
    var width = content.width;
    var system = systems[0] = {
      width: width,
      height: height,
      el: layoutSystem(content, 0, height, lo),
      measures: []
    };

    score.measures.forEach(function (measure) {
      x += measure.minWidth + lo.measurePaddingRight;
      if (x < width) {
        system.measures.push(measure);
        system.minWidth = x;
        x += lo.measurePaddingLeft;
      } else {
        x = measure.minWidth + lo.measurePaddingRight;
        i++;
        system = systems[i] = {
          width: width,
          height: height,
          el: layoutSystem(content, i, height, lo),
          measures: [measure]
        };
      }
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
      default:
        data.def = { width: 0, height: 0 };
      }
    });
  }

  function calcMinDimensionOfCells(score, lo) {
    score.walkCells(function (cell) {
      var x = 0, minHeight;
      cell.forEach(function (musicData) {
        x += musicData.def.width + lo.musicDataSep;
        minHeight = Math.min(minHeight, musicData.def.height);
      });
      cell.minWidth = x;
      cell.minHeight = minHeight;
    });
  }

  function calcMinWidthOfMeasures(measures) {
    measures.forEach(function (measure) {
      var minWidth = 0;
      measure.parts.forEach(function (cell) {
        minWidth = Math.max(minWidth, cell.minWidth);
      });
      measure.minWidth = minWidth;
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

    system.measures.forEach(function (measure) {
      measure.parts.forEach(function (cell) {
        cell.el = system.el.g()
          .transform(Snap.matrix().translate(xOffset, 0))
          .addClass('mus-cell');
        cell.height = system.height;
        width = cell.width = cell.minWidth * ratio;
        xOffset += width;

        cell.el.rect(0, -cell.height, cell.width, cell.height)
          .addClass('bbox');
      });
    });
  }

  // Extract bar in each cell out into the measure.
  function extractBar(measures) {
    measures.forEach(function (measure, measureIdx) {
      measure.parts.forEach(function (cell) {
        if (cell[cell.length - 1].__name__ === 'bar') {
          measure.rightBar = cell.pop();
        }
        if (cell[0].__name__ === 'bar') {
          measure.leftBar = cell.shift();
        } else {
          if (measureIdx === 0) {
            measure.leftBar = new musje.Bar('single');
          } else {
            measure.leftBar = measures[measureIdx - 1].rightBar;
          }
        }
      });
    });
  }

  musje.Score.prototype.layout = function (svg, lo) {
    var score = this;
    lo = objExtend(musje.layoutOptions, lo);
    svg = makeSvg(svg, lo);

    var
      body = makeBody(svg, lo),
      header = renderHeader(score, body, lo),
      content = makeContent(body, header, lo),
      systems;

    score.prepareTimewise();
    extractBar(score.measures);
    setMusicDataDef(score, svg, lo);
    calcMinDimensionOfCells(score, lo);
    calcMinWidthOfMeasures(score.measures);

    systems = makeSystems(score, content, lo);

    systems.forEach(function (system) {
      layoutCells(system, lo);
      system.measures.forEach(function (measure) {
        measure.parts.forEach(function (cell) {
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
    });

    return systems;
  };

}(Snap));
