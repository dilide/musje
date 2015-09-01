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
    }

  };

  [
    'Time', 'Bar', 'Note', 'Rest', 'Chord', 'Voice'
  ].forEach(function (className) {
    musje.defineProperties(musje[className].prototype, musje.MusicData);
  });

}(musje));
