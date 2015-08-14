/* global musje, angular, tv4, MIDI */

(function (musje, angular, tv4, MIDI) {
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

  function now() { return new Date().getTime(); }

  var demo = angular.module('musjeDemo', []);

  demo.controller('MusjeDemoCtrl', function ($scope, $http, $document) {
    var JSONSchema = musje.makeJSONSchema(musje.model);

    $scope.playDisabled = true;
    $scope.pauseDisabled = true;
    // $scope.stopDisabled = true;

    $scope.width = 650;
    $scope.fonts = fonts;
    $scope.selectedFont = $scope.fonts[11];

    $http.get('score-samples/望春風.txt').success(function (data) {
      $scope.src = data;
      $scope.run();
    });

    $document.ready(function () {
      MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano", // or multiple instruments
        onsuccess: function () {
          $scope.playDisabled = false;
          $scope.$digest();
        }
      });
    });

    $scope.run = function () {
      var t0 = now();
      try {
        var score = $scope.score = musje.parse($scope.src);
        $scope.parseTime = now() - t0;
        $document[0].title =  (score.head.title || 'Untitled') + ' - Musje';
        $scope.totalMeasures = score ? score.parts[0].measures.length : 0;
        // $scope.result = JSON.stringify(score, null, "  ");
        // $scope.converted = '' + score;

        if (!tv4.validate(JSON.parse(score.stringify()), JSONSchema)) {
          $scope.error =
                'Validation Error: ' + JSON.stringify(tv4.error, null, 2) +
              '\nValidation Missing: ' + JSON.stringify(tv4.missing, null, 2);
        } else {
          $scope.error = false;
        }
      } catch (err) {
        $scope.totalMeasures = 'N/A';
        $scope.error = '' + err;
      }
      t0 = now();
      $scope.render();
      $scope.renderTime = now() - t0;
    };

    $scope.render = function () {
      $scope.score.render('.mus-score', {
        fontFamily: $scope.selectedFont.name,
        width: $scope.width
      });
    };
    $scope.play = function () {
      $scope.score.play();
      // $scope.playDisabled = true;
      // $scope.stopDisabled = false;
    };
    $scope.stop = function () {
      $scope.score.stop();
    };

  });

  demo.directive('demoFooter', function () {
    return {
      restrict: 'A',
      templateUrl: 'demo-footer.html'
    };
  });

}(musje, angular, tv4, MIDI));
