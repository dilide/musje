/* global musje */

(function (musje) {
  'use strict';

  /**
   * A [beam][wiki] is a horizontal or diagonal line used to connect multiple consecutive notes (and occasionally rests) in order to indicate rhythmic grouping. Only eighth notes (quavers) or shorter can be beamed.
   *
   * [wiki]: https://en.wikipedia.org/wiki/Beam_(music)
   *
   * Beam is created by {@link musje.Cell#makeBeams} and
   * attached to {@link musje.Note} in {@link musje.Note#beams}[level]
   * @class
   * @param {string} value - Beam value: `'begin'`, `'continue'` or `'end'`.
   * @param {number} level - Beam level starting from 0 to up.
   * @param {musje.Note} note - The parent note.
   */
  musje.Beam = function (value, level, note) {
    /** @member */
    this.value = value;
    /** @member */
    this.level = level;
    /** @member */
    this.note = note;
  };

  /**
   * Get the end note of the beam group.
   * @return {musje.Note} End note of the beam group.
   */
  musje.Beam.prototype.endNote = function () {
    var next = this.note.next;

    while (next && next.beams && next.beams[this.level].value !== 'end') {
      next = next.next;
    }
    return next;
  };


}(musje));
