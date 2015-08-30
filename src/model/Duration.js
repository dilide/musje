/* global musje */

(function (musje) {
  'use strict';

  var
    TYPE_TO_STRING = {
      1: ' - - - ', 2: ' - ', 4: '', 8: '_', 16: '=', 32: '=_',
      64: '==', 128: '==_', 256: '===', 512: '===_', 1024: '===='
    },
    // Convert from duration type to number of underbars.
    TYPE_TO_UNDERBAR = {
      1: 0, 2: 0, 4: 0, 8: 1, 16: 2, 32: 3,
      64: 4, 128: 5, 256: 6, 512: 7, 1024: 8
    },
    DOT_TO_STRING = { 0: '', 1: '.', 2: '..' };

  /**
   * @class
   * @param duration {Object}
   */
  musje.Duration = function (duration) {
    musje.extend(this, duration);
  };

  musje.defineProperties(musje.Duration.prototype,
  /** @lends musje.Duration# */
  {
    /**
     * Type of duration.
     * @type {string}
     * @constant
     * @default
     */
    $type: 'Duration',

    /**
     * Beat type
     * @type {number}
     * @default
     */
    type: 4,

    /**
     * Dot with value of 0, 1, or 2.
     * @type {number}
     * @default
     */
    dot: 0,

    /**
     * Tie
     * @type {boolean}
     */
    tie: undefined,

    /**
     * `(Getter)` Duration measured in quarter note.
     * @type {number}
     */
    quarter: {
      get: function () {
        var d = 4 / this.type;
        return this.dot === 0 ? d :
               this.dot === 1 ? d * 1.5 : d * 1.75;
      }
    },

    /**
     * `(Getter)` Duration in second
     * Affected by the tempo.
     * @type {number}
     * @readonly
     */
    second: {
      get: function () {
        return this.quarter * 60 / 80; // / TEMPO;
      }
    },

    /**
     * `(Getter)` Underbar
     * @type {number}
     * @readonly
     */
    underbar: {
      get: function () {
        return TYPE_TO_UNDERBAR[this.type] || 0;
      }
    },

    /**
     * @return {string}
     */
    toString: function () {
      return TYPE_TO_STRING[this.type] + DOT_TO_STRING[this.dot];
    },

    toJSON: musje.makeToJSON({
      type: 4,
      dot: 0,
      // tie: undefined
    })
  });

}(musje));
