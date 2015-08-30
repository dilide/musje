/* global musje */

(function (musje) {
  'use strict';

  // Constants and helpers
  // =================================================================

  var
    A4_FREQUENCY = 440,
    A4_MIDI_NUMBER = 69,
    STEP_TO_MIDI_NUMBER = [null, 0, 2, 4, 5, 7, 9, 11],
    ACCIDENTAL_TO_ALTER = { '#' : 1, '##': 2, n: 0, b : -1, bb: -2 };

  function chars(ch, num) {
    return new Array(num + 1).join(ch);
  }

  function octaveString(octave) {
    return octave > 0 ? chars('\'', octave) :
           octave < 0 ? chars(',', -octave) : '';
  }

  function getAlter(pitch) {
    var
      note = pitch.note,
      step = pitch.step,
      data = note.cell.data,
      datum,
      i;

    for (i = note.index - 1; i >= 0; i--) {
      datum = data[i];
      if (datum.$type === 'Note' &&
          datum.pitch.step === step && datum.pitch.accidental) {
        // note.alterLink = datum;
        return datum.pitch.alter;
      }
    }
    return 0;
  }

  /**
   * @class
   * @param pitch {Object}
   */
  musje.Pitch = function (pitch) {
    musje.extend(this, pitch);
  };

  musje.defineProperties(musje.Pitch.prototype,
  /** @lends musje.Pitch.prototype */
  {
    /**
     * Step is a value of `1`, `2`, `3`, `4`, `5`, `6`, or `7`.
     * @type {number}
     * @default
     */
    step: 1,

    /**
     * Octave is an integer value from `-5` to `5` inclusive.
     * @type {number}
     * @default
     */
    octave: 0,

    /**
     * Accidental is either of
     * - `'#'` - sharp
     * - `'##'` - double sharp
     * - `'b'` - flat
     * - `'bb'` - double flat
     * - `'n'` - natural
     * - `''` - (none)
     * @type {string}
     */
    accidental: '',

    /**
     * Alter (from -2 to 2 inclusive)
     * @type {number}
     */
    alter: {
      get: function () {
        var acc = this.accidental;
        return acc ? ACCIDENTAL_TO_ALTER[acc] : getAlter(this);
      }
    },

    /**
     * The MIDI note number of the pitch
     * @type {number}
     */
    midiNumber: {
      get: function () {
        return (this.octave + 5) * 12 +
          STEP_TO_MIDI_NUMBER[this.step] + this.alter;
      }
    },

    /**
     * Frequency of the pitch
     * @type {number}
     */
    frequency: {
      get: function () {
        return A4_FREQUENCY * Math.pow(2, (this.midiNumber - A4_MIDI_NUMBER) / 12);
      }
    },

    /**
     * Convert to musje source code string.
     * @return {string} Converted musje source code string.
     */
    toString: function () {
      return this.accidental + this.step + octaveString(this.octave);
    },

    toJSON: musje.makeToJSON({
      step: 1,
      octave: 0,
      accidental: ''
    })
  });

}(musje));
