/*global Snap*/

var musje = musje || {};

(function (Snap) {
  'use strict';

  var
    // Convert from accidental src to unicode.
    // Double sharp and double flat are in astral plane.
    ACCIDENTAL_UNICODE = {
      '#': '\u266f', b: '\u266d', n: '\u266e',
      '##': 'x', bb: '\u266d\u266d' // to be changed
    },
    // Convert from duration type to number of underlines.
    NUM_UNDERLINES = {
      'undefined': 0, 0: 0, 1: 0, 2: 0, 4: 0,
      8: 1, 16: 2, 32: 3, 64: 4,
      128: 5, 256: 6, 512: 7, 1024: 8
    };

  var
    // Layout options are stored in musje.layout-options.js
    lo = musje.layoutOptions,
    baselineShift = lo.fontSize * 0.12,
    typeStrokeWidth = lo.fontSize * 0.05,
    underlineGap = lo.fontSize * 0.17;

  function near(a, b, epsilon) {
    epsilon = epsilon || 0.00001;
    return Math.abs(a - b) < epsilon;
  }

  function drawBBox(el) {
    var bb = el.getBBox();
    console.log(bb);
    s.rect(bb.x, bb.y, bb.width, bb.height)
      .addClass('bbox');
  }

  function createPitchDef(svg, note) {
    var
      stepFontSize = lo.fontSize,
      accidental = note.pitch.accidental,
      accidentalFontSize,
      accidentalShift,
      accidentalEl,
      abbox,
      stepEl,
      sbbox,
      octave = note.pitch.octave,
      octaveRadius = stepFontSize * 0.066,
      octaveStart = stepFontSize * 0.0,
      octaveGap = stepFontSize * 0.23,
      octaveEl,
      pitchEl = svg.g(),
      pbbox,
      type = note.duration.type,
      numUnderlines = NUM_UNDERLINES[type],
      i;

    // Draw accidental
    if (accidental) {
      accidentalFontSize = stepFontSize * 0.6;
      accidentalShift = stepFontSize * -0.3;
      accidentalEl = svg.text(0, accidentalShift, ACCIDENTAL_UNICODE[accidental])
        .attr('font-size', 0.7 * stepFontSize);
      abbox = accidentalEl.getBBox();
      pitchEl.add(accidentalEl);
    }

    // Draw step
    stepEl = svg.text(abbox ? abbox.x2 : 0, 0, note.pitch.step)
      .attr('font-size', stepFontSize);
    sbbox = stepEl.getBBox();
    pitchEl.add(stepEl);

    // Draw octave
    if (octave) {
      octaveEl = svg.g();
      if (octave > 0) {
        for (i = 0; i < octave; i++) {
          octaveEl.add(svg.circle(sbbox.cx, sbbox.y + octaveStart - octaveGap * i, octaveRadius));
        }
      } else {
        for (i = 0; i > octave; i--) {
          octaveEl.add(svg.circle(sbbox.cx, sbbox.y2 - octaveStart - octaveGap * i, octaveRadius));
        }
      }
      pitchEl.add(octaveEl);
    }

    pbbox = pitchEl.getBBox();
    pitchEl.attr('transform', Snap.format('translate({x},{y}) scale({sx},{sy}) translate(0,{y2})', {
      x: -pbbox.x,
      y: (octave >= 0 && numUnderlines === 0 ? -baselineShift : 0) - numUnderlines * underlineGap,
      sx: Math.pow(0.975, Math.abs(octave) + numUnderlines),
      sy: Math.pow(0.96, Math.abs(octave) + numUnderlines),
      y2: near(pbbox.y2, sbbox.y2) ? 0 : -pbbox.y2
    }));
    pitchEl.width = pbbox.width;
    pitchEl.height = pbbox.height;

    return pitchEl.toDefs();
  }

  function drawType(svg, opt) {
    var
      numUnderlines = NUM_UNDERLINES[opt.type],
      y = opt.y,
      i;

    for (i = 0; i < numUnderlines; i++) {
      svg.line(opt.x, y, opt.x2, y)
        .attr('stroke-width', typeStrokeWidth);
      y -= underlineGap;
    }
  }




  function renderNote(sheet, note, pos) {
    var el = createPitchDef(sheet, note);
    sheet.use(el).attr(pos);

    drawType(sheet, {
      type: note.duration.type,
      x: pos.x, y: pos.y, x2: pos.x + el.width
    });
  }

  function renderTime(sheet, time, left, bottom) {
    var timeGroup = sheet.g().attr({
        fontSize: lo.fontSize,
        textAnchor: 'middle'
      });
    timeGroup.text(left, bottom - 10, time.beats)
        .addClass('time');
    timeGroup.text(left, bottom + 10, time.beatType)
        .addClass('time');
    timeGroup.line(left - 10, bottom - 6, left + 10, bottom - 6);
  }


  function render(score, sheet) {
    var
      measures = score.parts[0].measures,
      baseline = 30,
      x = 0;

    measures.forEach(function (measure) {
      measure.forEach(function (data) {
        switch (data.__name__) {
        case 'note':
          renderNote(sheet, data, { x: x += 30, y: baseline });
          break;
        case 'time':
          renderTime(sheet, data, x += 30, baseline);
          break;
        }
      });
    });
  }

  musje.render = render;
}(Snap));
