/*global musje*/

// TODO: implement <select> for different fonts
var fonts = {
  serif: [
    'Georgia, serif',
    '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    '"Times New Roman", Times, serif'
  ],
  'sans-serif': [
    'Arial, Helvetica, sans-serif',
    '"Arial Black", Gadget, sans-serif',
    '"Arial Narrow", sans-serif',
    '"Comic Sans MS", cursive, sans-serif',
    'Century Gothic, sans-serif',
    'Impact, Charcoal, sans-serif',
    '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    'Tahoma, Geneva, sans-serif',
    '"Trebuchet MS", Helvetica, sans-serif',
    'Verdana, Geneva, sans-serif',
    'Copperplate, "Copperplate Gothic Light", sans-serif',
  ],
  monospace: [
    '"Courier New", Courier, monospace',
    '"Lucida Console", Monaco, monospace'
  ]
};

(function ($) {
  'use strict';

  $(function () {
    var
      $source = $('#source'),
      $result = $('#result'),
      $validate = $('#validate'),
      $measureCount = $('#measure-count'),
      svgSelector = 'svg',
      score;

    // $('#schema').text(JSON.stringify(musje.JSONSchema, null, 2));

    // Debounce -- Copy from underscore.js
    function debounce(func, wait) {
      var timeout, args, context, timestamp, result;

      function now() { return new Date().getTime(); }

      function later() {
        var last = now() - timestamp;

        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) { context = args = null; }
        }
      }

      return function() {
        context = this;
        args = arguments;
        timestamp = now();
        if (!timeout) {
          timeout = setTimeout(later, wait);
          result = func.apply(context, args);
          context = args = null;
        }
        return result;
      };
    }

    var run = debounce(function() {
      try {
        score = musje.parse($source.val());
        score = musje.score(score);
        $measureCount.html(score ? score.parts[0].measures.length : 0);
        $result.text('');
        // $result.text(JSON.stringify(score, null, "  "));
        // $result.removeClass('error');
        // $('#converted').text(score);

        $validate.text('Valid: ' +
          musje.validate(score.stringify()) +
          '\nValidation Error: ' +
          JSON.stringify(musje.validate.error, null, '  ') +
          '\nValidation Missing: ' +
          JSON.stringify(musje.validate.missing, null, '  ')
        );
      } catch (e) {
        $measureCount.html('N/A');
        $result.text(e);
        $result.addClass('error');
      }

      musje.render(score, svgSelector, {
        fontFamily: fonts.palatino
      });
    }, 300);

    run();

    $source.on('input propertychange', run);
    $('#playButton').on('click', function () { score.play(); });
  });
}(jQuery));
