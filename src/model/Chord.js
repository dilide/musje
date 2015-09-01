/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param {Object} chord
   * @mixes musje.MusicData
   * @mixes musje.LayoutMusicData
   */
  musje.Chord = function (chord) {
    musje.extend(this, chord);
  };

  musje.defineProperties(musje.Chord.prototype,
  /** @lends musje.Chord# */
  {
    /**
     * Type of chord.
     * @type {string}
     * @constant
     * @default
     */
    $type: 'Chord',

    /**
     * Pitches in the chord.
     * @type {Array.<musje.Pitch>}
     */
    pitches: {
      get: function () {
        return this._pitches || (this._pitches = []);
      },
      set: function (pitches) {
        this._pitches = pitches.map(function (pitch) {
          return new musje.Pitch(pitch);
        });
      }
    },

    /**
     * Duration of the chord.
     * @type {musje.Duration}
     */
    duration: {
      get: function () {
        return this._duration || (this._duration = new musje.Duration());
      },
      set: function (duration) {
        this._duration = new musje.Duration(duration);
      }
    },

    /**
     * Convert chord to the musje source code string.
     * @return {string} Converted musje source code of the chord.
     */
    toString: function () {
      return '<' + this.pitches.map(function (pitch) {
        return pitch.toString();
      }).join('') + '>' + this.duration;
    },

    toJSON: musje.makeToJSON({
      pitches: undefined,
      duration: undefined,
    }, 'chord')
  });

}(musje));
