/*global Snap*/

var musje = musje || {};

(function (Snap) {
  'use strict';

  var
    objExtend = musje.objExtend,
    svgPaths = musje.svgPaths;

  function near(a, b, epsilon) {
    epsilon = epsilon || 0.00001;
    return Math.abs(a - b) < epsilon;
  }

  // A cell is either a measure in a part or a part in a measure.
  function walkCells(score, callback) {
    score.parts.forEach(function (part, partIdx) {
      part.measures.forEach(function (cell, measureIdx) {
        callback(cell, measureIdx, partIdx);
      });
    });
  }

  function walkMusicData(score, callback) {
    walkCells(score, function (cell, measureIdx, partIdx) {
      cell.forEach(function (musicData, musicDataIdx) {
        callback(musicData, musicDataIdx, measureIdx, partIdx);
      });
    });
  }

  // function toTimeWise(score) {
  //   console.log(score);

  //   return score;
  // }


  function getBBoxAfterTransform(container, bbox, matrix) {
    var
      rect = container.rect(bbox.x, bbox.y, bbox.width, bbox.height),
      g = container.g(rect);

    rect.transform(matrix);
    bbox = g.getBBox();
    g.remove();
    return bbox;
 }

  function drawBBox(el) {
    var bb = el.getBBox();
    el.paper.rect(bb.x, bb.y, bb.width, bb.height)
      .addClass('bbox');
  }

  function drawBoxBolder(box) {
    box.rect(0, 0, box.width, box.height).addClass('bbox');
  }

  function drawMusicDataBolder(useEl, el) {
    var x = +useEl.attr('x'), y = +useEl.attr('y');
    useEl.parent().rect(x, y - el.height, el.width, el.height).addClass('bbox');
  }

  // =====================================================================

  // @constructor
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


  // @constructor
  // The `PitchDef` is defined by properties: a s o u
  // accidental step octave underbar
  function PitchDef(id, pitch, underbar, defs) {
    var
      svg = this._svg = defs._svg,
      el = this.el = svg.g().attr('id', id),
      accidental = pitch.accidental,
      matrix,
      sbbox,
      pbbox;

    this._defs = defs;
    this._lo = defs._lo;
    this._addAccidental(accidental);
    this._addStep(pitch.step);
    this._addOctave(pitch.octave);

    matrix = this._getTransformMatrix(accidental, pitch.octave, underbar);
    el.transform(matrix);

    sbbox = this._sbbox;
    sbbox = getBBoxAfterTransform(this.el, sbbox, matrix);

    pbbox = el.getBBox();
    el.toDefs();

    objExtend(this, {
      matrix: matrix,
      width: pbbox.width,
      height: -pbbox.y,
      stepY: sbbox.y,
      stepCy: sbbox.cy,
      stepY2: sbbox.y2
    });
  }
  PitchDef.prototype._addAccidental = function (accidental) {
    if (!accidental) {
      this._accidentalEndX = 0;
      return;
    }

    var
      id = 'a' + accidental.replace(/#/g, 's'),
      defs = this._defs,
      accDef = defs[id] || (defs[id] = new AccidentalDef(id, accidental, defs));

    this.el.use(accDef.el).attr('y', -this._lo.accidentalShift);
    this._accidentalEndX = accDef.width;
  };

  PitchDef.prototype._addStep = function (step) {
    this._sbbox = this.el
      .text(this._accidentalEndX, 0, '' + step)
      .attr('font-size', this._lo.fontSize)
      .getBBox();
  };

  PitchDef.prototype._addOctave = function (octave) {
    if (!octave) { return; }

    var
      lo = this._lo,
      octaveRadius = lo.octaveRadius,
      octaveOffset = lo.octaveOffset,
      octaveSep = lo.octaveSep,
      octaveEl = this.el.g(),
      i;

    if (octave > 0) {
      for (i = 0; i < octave; i++) {
        octaveEl.circle(this._sbbox.cx, this._sbbox.y + octaveOffset - octaveSep * i, octaveRadius);
      }
    } else {
      for (i = 0; i > octave; i--) {
        octaveEl.circle(this._sbbox.cx, this._sbbox.y2 - octaveOffset - octaveSep * i, octaveRadius);
      }
    }
    this.el.add(octaveEl);
  };

  // Transform the pitch to be in a good baseline position and
  // scale it to be more square.
  PitchDef.prototype._getTransformMatrix = function (hasAccidental, octave, underbar) {
    var
      lo = this._lo,
      pbbox = this.el.getBBox(),
      absOctave = Math.abs(octave);

    return Snap.matrix().translate(
        -pbbox.x,
        (octave >= 0 && underbar === 0 ? -lo.stepBaselineShift : 0) -
                            underbar * lo.underbarSep
      ).scale(
        Math.pow(0.97, absOctave + underbar + (hasAccidental ? 3 : 0)),
        Math.pow(0.95, absOctave + underbar + (hasAccidental ? 1 : 0))
      ).translate(
        0,
        near(pbbox.y2, this._sbbox.y2) ? 0 : -pbbox.y2
      );
  };

  // @constructor
  function DurationDef(svg, id, duration, lo) {
    this._svg = svg;
    this._lo = lo;

    // only make def el for:
    // id = d10, d11, d12, d20, d21, d20, d41, d40
    switch (duration.type) {
    case 1:   // whole note
      return this._makeType1(id, duration.dot);
    case 2:   // half note
      return this._makeType2(id, duration.dot);
    default:  // other note types type quarter note def
      return this._makeType4(id, duration.dot);
    }
  }
  DurationDef.prototype._addDot = function (el, x, dot, type) {
    var lo = this._lo;

    if (dot > 0) {
      x += lo.dotOffset * (type === 1 ? 1.2 : 1);
      el.circle(x, 0, lo.dotRadius);
    }
    if (dot > 1) {
      x += lo.dotSep * (type === 1 ? 1.2 : 1);
      el.circle(x, 0, lo.dotRadius);
    }
    return x + lo.typebarExt;
  };
  DurationDef.prototype._makeType1 = function (id, dot) {
    var
      lo = this._lo,
      el = this._svg.g().attr('id', id).toDefs(),
      width;

    el.path(Snap.format('M{off},0h{w}m{sep},0h{w}m{sep},0h{w}', {
      off: lo.typebarOffset,
      w: lo.typebarLength,
      sep: lo.typebarSep
    })).attr({
      stroke: 'black',
      strokeWidth: lo.typeStrokeWidth,
      fill: 'none'
    });

    width = this._addDot(el, lo.typebarOffset + 3 * lo.typebarLength +
                             2 * lo.typebarSep, dot, 2);

    return objExtend(this, {
      el: el,
      width: width,
      minWidth: width,
      maxWidth: width
    });
  };
  DurationDef.prototype._makeType2 = function (id, dot) {
    var
      lo = this._lo,
      el = this._svg.g().attr('id', id).toDefs(),
      x = lo.typebarOffset + lo.typebarLength,
      width;

    el.line(lo.typebarOffset, 0, x, 0)
      .attr('stroke-width', lo.typeStrokeWidth);

    width = this._addDot(el, x, dot, 2);

    return objExtend({
      el: el,
      width: width,
      minWidth: width,
      maxWidth: width
    });
  };
  DurationDef.prototype._makeType4 = function (id, dot) {
    if (dot === 0) { return objExtend(this, { width: 0 }); }

    var
      lo = this._lo,
      el = this._svg.g().attr('id', id).toDefs(),
      x = lo.t4DotOffset;

    el.circle(x += lo.t4DotOffset, -lo.t4DotBaselineShift, lo.dotRadius);
    if (dot > 1) {
      el.circle(x += lo.t4DotSep, -lo.t4DotBaselineShift, lo.dotRadius);
    }
    return objExtend(this, { el: el, width: x + lo.t4DotExt });
  };


  // @constructor
  function Defs(svg, layoutOptions) {
    this._svg = svg;
    this._lo = layoutOptions;
  }
  Defs.prototype.get = function (musicData) {
    var id = musicData.defId;
    return this[id] || (this[id] = this._make(id, musicData));
  };

  Defs.prototype._make = function (id, musicData) {
    var
      n = musicData.__name__,
      maker = '_make' + n.charAt(0).toUpperCase() + n.substr(1);
    return this[maker](id, musicData);
  };
  Defs.prototype._makeTime = function (id, time) {
    var
      svg = this._svg,
      lo = this._lo,
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
  };
  Defs.prototype._makeDuration = function (id, duration) {
    return new DurationDef(this._svg, id, duration, this._lo);
  };
  Defs.prototype._getPitch = function (id, pitch, underbar) {
    return this[id] ||
        (this[id] = new PitchDef(id, pitch, underbar, this));
  };
  Defs.prototype._makeNote = function (id, note) {
    var
      pitch = note.pitch,
      underbar = note.duration.underbar,
      pitchId = pitch.defId + underbar,
      pitchDef = this._getPitch(pitchId, pitch, underbar),
      durationDef = this.get(note.duration);

    return {
      pitchDef: pitchDef,
      durationDef: durationDef,
      height: pitchDef.height,
      width: pitchDef.width + durationDef.width,
      minWidth: pitchDef.width + durationDef.minWidth,
      maxWidth: pitchDef.width + durationDef.maxWidth
    };
  };
  Defs.prototype._makeRest = function(id, rest) {
    var
      duration = rest.duration,
      pitchDef = this._getPitch(id, { step: 0, octave: 0 }, duration.underbar),
      durationDef = this.get(duration);

    return {
      pitchDef: pitchDef,
      durationDef: durationDef,
      height: pitchDef.height,
      width: pitchDef.width + durationDef.width
    };
  };

  // @param cell {Array} either a measure in a part, or a part in a measure.
  // @param groupDur {number} Duration of a beam group in quarter.
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

var cell = musje.score(musje.parse('1=2=3=4=5_67=0=')).parts[0].measures[0];
console.log(findBeamGroup(cell, 1).join(' : '));
makeBeam(cell, 1);
console.log(cell.map(function (data) {
  return JSON.stringify(data.beam);
}))

  // ======================================================================

  function makeBody(svg, lo) {
    var
      body = svg.g()
        .transform(Snap.matrix().translate(lo.marginLeft, lo.marginTop))
        .addClass('mus-body'),
      width = lo.width - lo.marginLeft - lo.marginRight,
      height = lo.height - lo.marginTop - lo.marginBottom;

    return objExtend(body, {
      x: 0, y: 0, cx: width / 2, cy: height / 2,
      x2: width, width: width,
      y2: height, height: height
    });
  }

  function renderHeader(score, body, lo) {
    var
      header = body.g(
          body.text(body.cx, lo.titleFontSize, score.head.title)
            .attr({
              fontSize: lo.titleFontSize,
              fontWeight: lo.titleFontWeight,
              textAnchor: 'middle'
            }),
          body.text(body.x2, lo.titleFontSize * 1.5, score.head.composer)
            .attr({
              fontSize: lo.composerFontSize,
              fontWeight: lo.composerFontWeight,
              textAnchor: 'end'
            })
        ).addClass('mus-header'),
      height = header.getBBox().height;

    // Geometry is defined inside the body frame.
    return objExtend(header, {
      x: 0, y: 0, cx: body.cx, cy: height / 2,
      x2: body.x2, width: body.width,
      y2: height, height: height
    });
  }

  function makeContent(body, header, lo) {
    var
      yOffset = header.y2 + lo.headerSep,
      height = body.height - yOffset,
      content = body.g()
        .transform(Snap.matrix().translate(0, yOffset))
        .addClass('mus-content');

    return objExtend(content, {
      x: 0, y: 0, cx: body.cx, cy: height / 2,
      x2: body.x2, width: body.width,
      y2: height, height: height
    });
  }

  function setMusicDataDef(score, svg, lo) {
    var defs = new Defs(svg, lo);

    walkCells(score, function (cell) {
      findBeamGroup(cell, 1);
    });

    walkMusicData(score, function (data) {
      switch (data.__name__) {
      case 'rest':  // fall through
      case 'note':
        data.def = defs.get(data);
        break;
      case 'time':
        data.def = defs.get(data);
        break;
      case 'bar':
        break;
      }
    });
  }

  function layout(score, svg, lo) {

    var
      body = makeBody(svg, lo),
      header = renderHeader(score, body, lo),
      content = makeContent(body, header, lo);

    // drawBoxBolder(body);
    // drawBoxBolder(header);
    // drawBoxBolder(content);

    var x = 0, baseline = 30, m = 0;

    setMusicDataDef(score, svg, lo);

    walkMusicData(score, function (data) {
      switch (data.__name__) {
      case 'rest':  // fall through
      case 'note':
        data.pos = { x: x, y: baseline };
        x += data.def.width + lo.musicDataSep;
        break;
      case 'time':
        data.pos = { x: x, y: baseline };
        x += data.def.width + lo.musicDataSep;
        break;
      case 'bar':
        x += lo.measurePaddingRight - lo.musicDataSep;
        data.pos = { x: x, y: baseline };
        x += lo.measurePaddingLeft;
        m ++;
        if (m % 4 === 0) { x = 0; baseline += 55; }
        break;
      }
    });

    // console.log(defs['n1010'].durationDef.el.attr('id'))

    return content;
  }

  musje.render = function (score, svg, lo) {
    // score = toTimeWise(score);
    lo = objExtend(musje.layoutOptions, lo);
    svg = Snap(svg).attr({
      fontFamily: lo.fontFamily,
      width: lo.width, height: lo.height
    });
    svg.clear();

    var content = layout(score, svg, lo);

    //================================================

    function renderDuration(note) {

      // Render duration..........
      var durationDef = note.def.durationDef;
      var pitchDef = note.def.pitchDef;

      var underbar = note.duration.underbar;
      var durationWidth = durationDef.width;
      var x = note.pos.x + pitchDef.width;

      // Whole and half notes
      if (note.duration.type < 4) {
        content.use(durationDef.el).attr({
          x: x,
          y: note.pos.y + pitchDef.stepCy
        });
      } else {
        // Dots for quarter or shorter notes
        if (note.duration.dot) {
          content.g().transform(Snap.matrix().translate(x, note.pos.y))
            .use(durationDef.el).transform(pitchDef.matrix);
        }
        // Eigth or shorter notes
        if (underbar) {
          var y = note.pos.y, x0 = x - pitchDef.width;
          durationWidth = durationDef.width * pitchDef.matrix.split().scalex;
          for (var i = 0; i < underbar; i++) {
            content.line(x0, y, x + durationWidth, y)
              .attr('stroke-width', lo.typeStrokeWidth);
            y -= lo.underbarSep;
          }
        }
      }
    }

    function renderBar(bar) {
      var x = bar.pos.x, baseline = bar.pos.y;

      switch (bar.value) {
      case 'single':
        x += lo.thinBarlineWidth / 2;
        content.line(x, baseline - 25, x, baseline + 5)
          .attr({ strokeWidth: lo.thinBarlineWidth });
        x += lo.thinBarlineWidth / 2;
        break;
      case 'end':
        x += lo.thinBarlineWidth / 2;
        content.line(x, baseline - 25, x, baseline + 5)
          .attr({ strokeWidth: lo.thinBarlineWidth });
        x += lo.thinBarlineWidth / 2 + lo.barlineSep +
             lo.thickBarlineWidth / 2;
        content.line(x, baseline - 25, x, baseline + 5)
          .attr({ strokeWidth: lo.thickBarlineWidth });
        x += lo.thickBarlineWidth / 2;
        break;
      }
    }

    // content.line(x, baseline, content.width, baseline).addClass('ref-line');

    walkMusicData(score, function (data) {
      switch (data.__name__) {
      case 'rest':  // fall through
      case 'note':
        data.el = content.use(data.def.pitchDef.el).attr(data.pos);
        // drawMusicDataBolder(data.el, data.def);
        renderDuration(data);
        break;
      case 'time':
        data.el = content.use(data.def.el).attr(data.pos);
        // drawMusicDataBolder(data.el, data.def);
        break;
      case 'bar':
        renderBar(data);
        break;
      }
    });
  };

}(Snap));
