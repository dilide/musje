$(function () {
  'use strict';

  var
    $source = $('#source'),
    $result = $('#result'),
    $validate = $('#validate'),
    $measureCount = $('#measure-count'),
    svg = d3.select('svg')
      .attr('width', outerWidth)
      .attr('height', outerHeight),
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
    sheet = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    render(sheet, score);
  }

  run();

  $source.on('keyup', run);
  $('#playButton').on('click', function () { score.play(); });
});

