/*global Snap*/

var musje = musje || {};

(function (Snap) {
  'use strict';

  var objExtend = musje.objExtend;

  function near(a, b, epsilon) {
    epsilon = epsilon || 0.00001;
    return Math.abs(a - b) < epsilon;
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


  function addAccidental(pitchEl, accidentalUnicode, lo) {
    if (!accidentalUnicode) { return 0; }
    return pitchEl
      .text(0, -lo.accidentalShift * lo.fontSize, accidentalUnicode)
      .attr('font-size', lo.accidentalFontSize * lo.fontSize)
      .getBBox().x2;
  }

  function addStep(pitchEl, step, accidentalEndX, lo) {
    return pitchEl
      .text(accidentalEndX, 0, step)
      .attr('font-size', lo.fontSize);
    }

  function addOctave(pitchEl, octave, sbbox, lo) {
    var
      octaveRadius = lo.fontSize * lo.octaveRadius,
      octaveOffset = lo.fontSize * lo.octaveOffset,
      octaveSep = lo.fontSize * lo.octaveSep,
      octaveEl, i;

    if (octave) {
      octaveEl = pitchEl.g();
      if (octave > 0) {
        for (i = 0; i < octave; i++) {
          octaveEl.circle(sbbox.cx, sbbox.y + octaveOffset - octaveSep * i, octaveRadius);
        }
      } else {
        for (i = 0; i > octave; i--) {
          octaveEl.circle(sbbox.cx, sbbox.y2 - octaveOffset - octaveSep * i, octaveRadius);
        }
      }
      pitchEl.add(octaveEl);
    }
  }

  function getBBoxHack(svg, bbox, matrix) {
    var
      rect = svg.rect(bbox.x, bbox.y, bbox.width, bbox.height),
      g = svg.g(rect);

    rect.transform(matrix);
    bbox = g.getBBox();
    g.remove();
    return bbox;
 }

  // Transform the pitch to be in a good baseline position and
  // scale it to be more square.
  function transformPitch(pitchEl, hasAccidental, octave, underbar, sbbox, lo) {
    var
      stepBaselineShift = -lo.fontSize * lo.stepBaselineShift,
      pbbox = pitchEl.getBBox(),
      octaveAbs = Math.abs(octave),
      matrix = Snap.matrix().translate(
          -pbbox.x,
          (octave >= 0 && underbar === 0 ? stepBaselineShift : 0) -
                              underbar * lo.fontSize * lo.underbarSep
        ).scale(
          Math.pow(0.975, octaveAbs + underbar + (hasAccidental ? 3 : 0)),
          Math.pow(0.96, octaveAbs + underbar + (hasAccidental ? 1 : 0))
        ).translate(
          0,
          near(pbbox.y2, sbbox.y2) ? 0 : -pbbox.y2
        );

    pitchEl.transform(matrix);

    return getBBoxHack(pitchEl.paper, sbbox, matrix);
  }

  // @constructor
  function Defs(svg, layoutOptions) {
    this.svg = svg;
    this.lo = layoutOptions;
  }
  Defs.prototype.get = function (musicData) {
    var id = musicData.defId;
    return this[id] || (this[id] = this._prepare(id, musicData));
  };
  Defs.prototype._prepare = function (id, musicData) {
    switch (musicData.__name__) {
    case 'note':
      return this.makeNoteDef(id, musicData);
    case 'time':
      return this.makeTimeDef(id, musicData);
    }
  };
  Defs.prototype.makeTimeDef = function(id, time) {
    var
      svg = this.svg,
      lo = this.lo,
      fontSize = lo.timeFontSize,
      lineExtend = fontSize * 0.1,
      timeEl = svg.g(
          svg.text(0, -1 * fontSize, time.beats),
          svg.text(0, 0, time.beatType)   // baseline y = 0
        )
        .attr({
          id: id,
          fontSize: lo.timeFontSize,
          fontWeight: lo.timeFontWeight,
          textAnchor: 'middle'
        }),
      bb = timeEl.getBBox(),
      lineY = -0.85 * fontSize;

    timeEl.line(bb.x - lineExtend, lineY, bb.x2 + lineExtend, lineY);
    timeEl.transform(Snap.matrix().scale(1, 0.8).translate(lineExtend - bb.x, 0));
    bb = timeEl.getBBox();
    timeEl.toDefs();

    return objExtend(timeEl, {
      width: bb.width, height: -bb.y
    });
  };
  Defs.prototype.makePitchDef = function (id, pitch, underbar) {
    var
      lo = this.lo,
      octave = pitch.octave,
      pitchEl = this.svg.g().attr('id', id),
      accidentalEndX,
      stepEl,
      sbbox,
      pbbox;

    accidentalEndX = addAccidental(pitchEl, pitch.accidentalUnicode, lo);
    stepEl = addStep(pitchEl, pitch.step, accidentalEndX, lo);
    sbbox = stepEl.getBBox();
    addOctave(pitchEl, octave, sbbox, lo);
    sbbox = transformPitch(pitchEl, accidentalEndX, octave, underbar, sbbox, lo);

    pbbox = pitchEl.getBBox();
    pitchEl.toDefs();

    return objExtend(pitchEl, {
      width: pbbox.width, height: -pbbox.y,
      stepY: sbbox.y, stepCy: sbbox.cy, stepY2: sbbox.y2
    });
  };
  Defs.prototype.makeNoteDef = function (id, note) {
    var
      lo = this.lo,
      pitch = note.pitch,
      duration = note.duration,
      type = duration.type,
      pitchId = pitch.defId + note.duration.underbar,
      pitchDef =  this[pitchId] ||
          (this[pitchId] = this.makePitchDef(pitchId, pitch, duration.underbar));

      return {
        pitchDef: pitchDef,
        width: pitchDef.width +
           duration.dot * lo.dotSep * lo.fontSize +
          (type === 2 ? lo.typebarOffset + lo.typebarWidth :
           type === 1 ? lo.typebarOffset + 2 * lo.typebarSep + 3 * lo.typebarWidth :
                        0) * lo.fontSize,
        height: pitchDef.height
      };
  };


  // Only for testing purposes...
  function renderDuration(container, pitchDef, duration, lo, dimension) {
    var
      underbar = duration.underbar,
      typeStrokeWidth = lo.typeStrokeWidth * lo.fontSize,
      typebarOffset = lo.typebarOffset * lo.fontSize,
      typebarWidth = lo.typebarWidth * lo.fontSize,
      typebarSep = lo.typebarSep * lo.fontSize,
      x0,
      y,
      i;

    switch (duration.type) {
    case 2:   // half
      y = dimension.baseline + pitchDef.stepCy;
      x0 = dimension.x + pitchDef.width + typebarOffset;
      container.line(x0, y, x0 + typebarWidth, y)
        .attr('stroke-width', typeStrokeWidth);
      break;
    case 1:   // whole
      y = dimension.baseline + pitchDef.stepCy;
      x0 = dimension.x + pitchDef.width + typebarOffset;
      container.line(x0, y, x0 + typebarWidth, y)
        .attr('stroke-width', typeStrokeWidth);
      x0 += typebarWidth + typebarSep;
      container.line(x0, y, x0 + typebarWidth, y)
        .attr('stroke-width', typeStrokeWidth);
      x0 += typebarWidth + typebarSep;
      container.line(x0, y, x0 + typebarWidth, y)
        .attr('stroke-width', typeStrokeWidth);
      break;
    default:  // others
      y = dimension.baseline;
      for (i = 0; i < underbar; i++) {
        container.line(dimension.x, y, dimension.x2, y)
          .attr('stroke-width', lo.typeStrokeWidth * lo.fontSize);
        y -= lo.underbarSep * lo.fontSize;
      }
    }
  }


  // ======================================================================

  function makeBody(svg, lo) {
    var body = svg.g().transform(Snap.matrix().translate(lo.marginLeft, lo.marginTop)),
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
      header = body.g(body.text(body.cx, lo.titleFontSize, score.head.title)
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
          })),
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
      yOffset = header.y2 + lo.headerSep * lo.fontSize,
      height = body.height - yOffset,
      content = body.g().transform(Snap.matrix().translate(0, yOffset));

    return objExtend(content, {
      x: 0, y: 0, cx: body.cx, cy: height / 2,
      x2: body.x2, width: body.width,
      y2: height, height: height
    });
  }

  function walkMusicData(score, callback) {
    score.parts.forEach(function (part, partIdx) {
      part.measures.forEach(function (measure, measureIdx) {
        measure.forEach(function (musicData, musicDataIdx) {
          callback(musicData, musicDataIdx, measureIdx, partIdx);
        });
      });
    });
  }



  musje.render = function (score, svg, lo) {
    lo = objExtend(musje.layoutOptions, lo);
    svg = Snap(svg).attr({ width: lo.width, height: lo.height });
    svg.clear();

    var
      defs = new Defs(svg, lo),
      body = makeBody(svg, lo),
      header = renderHeader(score, body, lo),
      content = makeContent(body, header, lo);

    // drawBoxBolder(body);
    // drawBoxBolder(header);
    // drawBoxBolder(content);

    //================================================

    var x = 0, baseline = 30;

    function renderTime(time) {
      var el = defs.get(time);
      var useEl = content.use(el).attr({ x: x, y: baseline });
      // drawMusicDataBolder(useEl, el);
      x += el.width + lo.musicDataSep * lo.fontSize;
    }

    function renderNote(note) {
      var noteDef = defs.get(note);
      var pitchDef = noteDef.pitchDef;
      var useEl = content.use(pitchDef).attr({ x: x, y: baseline });
      // drawMusicDataBolder(useEl, noteDef);
      renderDuration(content, pitchDef, note.duration, lo, {
        x: x,
        baseline: baseline,
        x2: x + noteDef.width,
      });
      x += noteDef.width + lo.musicDataSep * lo.fontSize;
    }

    content.line(x, baseline, content.width, baseline).addClass('ref-line');

    walkMusicData(score, function (data) {
      switch (data.__name__) {
      case 'note':
        renderNote(data);
        break;
      case 'time':
        renderTime(data);
        break;
      }
    });
  };

}(Snap));
