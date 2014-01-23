
var
  accSymbol = {
    b: '\u266d',        // flat
    bb: '\u266d\u266d', // double flat
    n: '\u266e',        // natural
    '#': '\u266f',      // sharp
    '##': 'x'           // double sharp
  },
  dummy = null;

var
  outerWidth = 600,
  outerHeight = 50,
  margin = { top: 5, right: 5, bottom: 5, left: 5 },
  width = outerWidth - margin.left -margin.right,
  height = outerHeight - margin.top - margin.bottom;

function renderNote(sheet, note, left, bottom) {
  var
    noteGroup = sheet.append('g'),
    text = sheet.append('text')
      .attr('x', left)
      .attr('y', bottom);

  var
    pitch = note.pitch,
    acc = pitch.accidental,
    octave = pitch.octave;

  if (acc) {
    text.append('tspan')
      .attr('class', 'accidental')
      .attr('dx', -10)
      .attr('dy', -5)
      .text(accSymbol[acc]);
    text.append('tspan')
      .attr('class', 'step')
      .attr('dy', 5)
      .text(pitch.step);
  } else {
    text.attr('class', 'step').text(pitch.step);
  }

  if (octave) {
    if (octave === 1) {

    } else if (octave === -1) {
      noteGroup.append('circle')
        .attr('cx', left + 5)
        .attr('cy', bottom + 3)
        .attr('r', 1)
        .attr('stroke-width', 1);
    }
  }
}

function renderTime(sheet, time, left, bottom) {
  var timeGroup = sheet.append('g');
  timeGroup.append('text')
      .attr('class', 'time')
      .attr('x', left)
      .attr('y', bottom - 10)
      .text(time.beats);
  timeGroup.append('text')
      .attr('class', 'time')
      .attr('x', left)
      .attr('y', bottom + 10)
      .text(time.beatType);
  timeGroup.append('line')
    .attr('x1', left - 10)
    .attr('y1', bottom - 6)
    .attr('x2', left + 10)
    .attr('y2', bottom - 6)
    .attr('stroke-width', 1)
    .attr('stroke', 'black');
}

function render(sheet, score) {
  var
    measure = score.parts[0].measures[0],
    baseline = 20,
    x = 0;

  _.each(measure, function (data) {
    switch (data.__name__) {
    case 'note':
      renderNote(sheet, data, x += 30, baseline);
      break;
    case 'time':
      renderTime(sheet, data, x += 30, baseline);
      break;
    }
  });
}

