/*global angular,musje,MIDI*/

(function () {
  'use strict';

  var fonts = [
    { type: 'serif', name: 'Georgia, serif' },
    { type: 'serif', name: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
    { type: 'serif', name: '"Times New Roman", Times, serif' },
    { type: 'sans-serif', name: 'Arial, Helvetica, sans-serif' },
    { type: 'sans-serif', name: '"Arial Black", Gadget, sans-serif' },
    { type: 'sans-serif', name: '"Arial Narrow", sans-serif' },
    { type: 'sans-serif', name: '"Comic Sans MS", cursive, sans-serif' },
    { type: 'sans-serif', name: 'Century Gothic, sans-serif' },
    { type: 'sans-serif', name: 'Impact, Charcoal, sans-serif' },
    { type: 'sans-serif', name: '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
    { type: 'sans-serif', name: 'Tahoma, Geneva, sans-serif' },
    { type: 'sans-serif', name: '"Trebuchet MS", Helvetica, sans-serif' },
    { type: 'sans-serif', name: 'Verdana, Geneva, sans-serif' },
    { type: 'sans-serif', name: 'Copperplate, "Copperplate Gothic Light", sans-serif' },
    { type: 'monospace', name: '"Courier New", Courier, monospace' },
    { type: 'monospace', name: '"Lucida Console", Monaco, monospace' }
  ];

  var src = '                        <<<望春風>>>                    鄧雨賢\n' +
            '4/4 5,.5,_ (6, 1) | 2 (1_2_)  3 - | (5. 3_) (3_2_)1| 2 - - - |\n' +
            ' (3. 5_) 5 (3_5_) | (1.  2_)  2 - | (5,.3_) (3  2) | 1 - - - |\n' +
            '  2. 2_  3 (2_1_) | 6,(5,_6,_) 1- | (6,.1_) (2  3) | 5 - - - |\n' +
            '  5. 5_  6 (5_3_) | 3 (2_1_)  6,- |  5,. 3_ (3  2) | 1 - - -|]';

  var demo = angular.module('musjeDemo', []);

  demo.controller('MusjeDemoCtrl', function ($scope, $document) {
    var score;
    function run() {
      try {
        score = musje.parse($scope.src);
        score = musje.score(score);
        $document[0].title =  (score.head.title || 'Untitled') + ' - Musje';
        $scope.totalMeasures = score ? score.parts[0].measures.length : 0;
        $scope.hasError = false;
        $scope.result = '';
        // $scope.result = JSON.stringify(score, null, "  ");
        // $scope.converted = '' + scosre;

        $scope.validate = 'Valid: ' + musje.validate(score.stringify()) +
          '\nValidation Error: ' +
          JSON.stringify(musje.validate.error, null, '  ') +
          '\nValidation Missing: ' +
          JSON.stringify(musje.validate.missing, null, '  ');
      } catch (err) {
        $scope.totalMeasures = 'N/A';
        $scope.result = '' + err;
        $scope.hasError = true;
      }

      musje.render(score, 'svg', {
        fontFamily: $scope.selectedFont.name
      });
    }

    // $scope.playDisabled = true;
    $scope.pauseDisabled = true;
    // $scope.stopDisabled = true;

    $scope.fonts = fonts;
    $scope.selectedFont = $scope.fonts[11];
    $scope.src = src;
    $scope.run = run;
    $scope.play = function () {
      score.play();
      // $scope.playDisabled = true;
      // $scope.stopDisabled = false;
    };
    $scope.stop = function () {
      score.stop();
    };

    $document.ready(function () {
      run();
      MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano", // or multiple instruments
        onsuccess: function () {
          $scope.playDisabled = false;
        }
      });
    });

  });

}());
