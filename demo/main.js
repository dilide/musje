$(function () {
  'use strict';

  var
    $source = $('#source'),
    $result = $('#result'),
    $validate = $('#validate'),
    $measureCount = $('#measure-count'),
    lo = musje.layoutOptions,
    svg = Snap('svg').attr(lo),
    sheet, score;

  // $('#schema').text(JSON.stringify(musje.JSONSchema, null, 2));

  function run() {
    try {
      score = musje.parse($source.val());
      score = musje.score(score);
      $measureCount.html(score ? score.parts[0].measures.length : 0);
      $result.text(JSON.stringify(score, null, "  "));
      $result.removeClass('error');
      $('#converted').text(score);

      $validate.text('Valid: ' + musje.validate(score.stringify()) +
        '\nValidation Error: ' +
        JSON.stringify(musje.validate.error, null, '  ') +
        '\nValidation Missing: ' +
        JSON.stringify(musje.validate.missing, null, '  '));
    } catch (e) {
      $measureCount.html('N/A');
      $result.text(e);
      $result.addClass('error');
    }

    // Render score
    if (sheet) { sheet.remove(); }
    sheet = svg.g()
      .attr('transform', 'translate(' + lo.marginLeft + ',' + lo.marginTop + ')');

    musje.render(score, sheet);
  }

  run();

  $source.on('keyup', run);
  $('#playButton').on('click', function () { score.play(); });
});


// var pos = { x: 20, y: 50 };
// s.line(pos.x, pos.y, pos.x + 200, pos.y).addClass('ref-line');

// for (var n = 1; n < 8; n++) {
//   var note = {
//     pitch: {
//       step: n, accidental: '#', octave: n % 4
//     },
//     duration: {
//       type: 512 / Math.pow(2, n)
//     }
//   };
//   var el = createPitchDef(note);
//   s.use(el).attr({ x: pos.x, y: pos.y });

//   drawType({
//     type: note.duration.type,
//     x: pos.x, y: pos.y, x2: pos.x + el.width
//   });

//   pos.x += el.width + 3;
// }

// var pos = { x: 20, y: 90 };
// s.line(pos.x, pos.y, pos.x + 200, pos.y).addClass('ref-line');

// for (var n = 1; n < 8; n++) {
//   var note = {
//     pitch: {
//       step: n, accidental: '#', octave: -n % 4
//     },
//     duration: {
//       type: 512 / Math.pow(2, n)
//     }
//   };
//   var el = createPitchDef(note);
//   s.use(el).attr({ x: pos.x, y: pos.y });

//   drawType({
//     type: note.duration.type,
//     x: pos.x, y: pos.y, x2: pos.x + el.width
//   });

//   pos.x += el.width + 3;
// }
