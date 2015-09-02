/* global musje */

(function (musje) {
  'use strict';

  /**
   * Music data mixin
   * @mixin
   */
  musje.MusicData =
  /** @lends musje.MusicData# */
  {

    /**
     * The ascendant system of the music data.
     * @type {musje.Layout.System}
     * @readonly
     */
    system: {
      get: function () {
        return this.cell.measure.system;
      }
    },

    /**
     * Previous music data.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    prev: {
      get: function () {
        return this.cell.data[this._index - 1];
      }
    },

    /**
     * Next music data.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    next: {
      get: function () {
        return this.cell.data[this._index + 1];
      }
    },

    /**
     * Previous music data in part, across measure.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    prevInPart: {
      get: function () {
        var prev = this.prev, cell = this.cell;
        while (!prev && cell.prev) {
          if (!prev) {
            cell = cell.prev;
            prev = cell.lastData;
          }
        }
        return prev;
      }
    },

    /**
     * Next music data in part, across measure.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    nextInPart: {
      get: function () {
        var next = this.next, cell = this.cell;
        while (!next && cell.next) {
          if (!next) {
            cell = cell.next;
            next = cell.firstData;
          }
        }
        return next;
      }
    },

    /**
     * Previous music data which has a duration.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    prevDurable: {
      get: function () {
        var prev = this.prev;
        while (prev && !prev.duration) {
          prev = prev.prev;
        }
        return prev;
      }
    },

    /**
     * Next music data which has a duration.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    nextDurable: {
      get: function () {
        var next = this.next;
        while (next && !next.duration) {
          next = next.next;
        }
        return next;
      }
    },

    /**
     * Previous music data which has a duration in part, across measure.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    prevDurableInPart: {
      get: function () {
        var prev = this.prevInPart;
        while (prev && !prev.duration) {
          prev = prev.prevInPart;
        }
        return prev;
      }
    },

    /**
     * Next music data which has a duration in part, across measure.
     * @type {musje.MusicData|undefined}
     * @readonly
     */
    nextDurableInPart: {
      get: function () {
        var next = this.nextInPart;
        while (next && !next.duration) {
          next = next.nextInPart;
        }
        return next;
      }
    }

  };

  [
    'Time', 'Bar', 'Note', 'Rest', 'Chord', 'Voice'
  ].forEach(function (className) {
    musje.defineProperties(musje[className].prototype, musje.MusicData);
  });

}(musje));
