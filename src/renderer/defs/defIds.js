/* global musje, Snap */

(function (musje) {
  'use strict';

  var BAR_TO_ID = {
    single: 'bs', double: 'bd', end: 'be',
    'repeat-begin': 'brb', 'repeat-end': 'bre', 'repeat-both': 'brbe'
  };

  var defIds = {
    Time: function () {
      return ['t', this.beats, '-', this.beatType].join('');
    },
    Bar: function () {
      return BAR_TO_ID[this.value];
    },
    Note: function () {
      var pitch = this.pitch, duration = this.duration;
      return [
        'n', pitch.accidental.replace(/#/g, 's'),
        pitch.step, pitch.octave, duration.type, duration.dot
      ].join('');
    },
    Rest: function () {
      var duration = this.duration;
      return 'r' + duration.type + duration.dot;
    },
    Pitch: function () {
      return ['p', this.accidental.replace(/#/g, 's'),
                   this.step, this.octave].join('');
    },
    Duration: function () {
      return 'd' + this.type + this.dot;
    }
  };

  musje.objEach(defIds, function (getter, className) {
    Object.defineProperty(musje[className].prototype, 'defId', {
      get: getter
    });
  });

}(musje, Snap));
