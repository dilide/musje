/* global musje */

(function (musje) {
  'use strict';

  /**
   * Slur
   * @class
   * @param {string} value - Beam value: `'begin'`, `'continue'` or `'end'`.
   * @param {number} level - Beam level starting from 0 to up.
   * @param {musje.Note} note - The parent note.
   */
  musje.Slur = function (value, level, note) {
    /** @member */
    this.value = value;
    /** @member */
    this.level = level;
    /** @member */
    this.note = note;
  };


}(musje));
