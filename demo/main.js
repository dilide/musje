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

  var demo = angular.module('musjeDemo', []);

  demo.controller('MusjeDemoCtrl', function ($scope, $http, $document) {
    var JSONSchema = musje.makeJSONSchema(musje.model);

    $scope.run = function () {
      try {
        var score = $scope.score = musje.parse($scope.src);
        $document[0].title =  (score.head.title || 'Untitled') + ' - Musje';
        $scope.totalMeasures = score ? score.parts[0].measures.length : 0;
        $scope.hasError = false;
        $scope.result = '';
        // $scope.result = JSON.stringify(score, null, "  ");
        // $scope.converted = '' + score;

        $scope.validate = 'Valid: ' + tv4.validate(JSON.parse(score.stringify()), JSONSchema) +
          '\nValidation Error: ' +
          JSON.stringify(tv4.error, null, '  ') +
          '\nValidation Missing: ' +
          JSON.stringify(tv4.missing, null, '  ');
      } catch (err) {
        $scope.totalMeasures = 'N/A';
        $scope.result = '' + err;
        $scope.hasError = true;
      }
      $scope.render();
    };

    $scope.playDisabled = true;
    $scope.pauseDisabled = true;
    // $scope.stopDisabled = true;

    $scope.fonts = fonts;
    $scope.selectedFont = $scope.fonts[11];

    $http.get('score-samples/望春風.txt').success(function (data) {
      $scope.src = data;
      $scope.run();
    });

    $scope.render = function () {
      $scope.score.render('.mus-score', {
        fontFamily: $scope.selectedFont.name
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

  });

  demo.directive('demoFooter', function () {
    return {
      restrict: 'A',
      templateUrl: 'demo-footer.html'
    };
  });

}(musje, angular, tv4, MIDI));
