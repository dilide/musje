/* global musje */

(function (musje) {
  'use strict';

  /**
   * A [beam][wiki] is a horizontal or diagonal line used to connect multiple consecutive notes (and occasionally rests) in order to indicate rhythmic grouping. Only eighth notes (quavers) or shorter can be beamed.
   *
   * [wiki]: https://en.wikipedia.org/wiki/Beam_(music)
   *
   * Beam is created by {@link musje.Cell#makeBeams} and
   * attached to {@link musje.Durable} in {@link musje.Durable#beams}[level]
   * @class
   * @param {string} value - Beam value: `'begin'`, `'continue'` or `'end'`.
   * @param {number} level - Beam level starting from 0 to up.
   * @param {musje.Durable} parent - The parent durable music data.
   */
  musje.Beam = function (value, level, parent) {

    /** @member */
    this.value = value;

    /** @member */
    this.level = level;

    /** @member */
    this.parent = parent;
  };

  musje.defineProperties(musje.Beam.prototype,
  /** @lends musje.Beam# */
  {

  /**
   * The end parent music data of the beam group.
   * @type {musje.MusicData}
   */
  endDurable: {
      get: function () {
        var nextData = this.parent.next;

        while (nextData && nextData.beams[this.level].value !== 'end') {
          nextData = nextData.next;
        }
        return nextData;
      }
    }
  });

}(musje));
