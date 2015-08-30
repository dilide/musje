/* global musje */

(function (musje) {
  'use strict';

  /**
   * Construct head of the score.
   * @class
   * @param {Object} head
   */
  musje.ScoreHead = function (head) {
    musje.extend(this, head);
  };

  musje.defineProperties(musje.ScoreHead.prototype,
  /** @lends musje.ScoreHead# */
  {
    /**
     * Title of the song.
     * @type {string}
     */
    title: undefined,

    /**
     * Composer of the song.
     * @type {string}
     */
    composer: undefined,

    // isEmpty: function () {
    //   return !this.title && !this.composer;
    // },

    /**
     * Convert score head to string.
     * @return {string} The converted musje head source code.
     */
    toString: function () {
      return '<<' + this.title + '>>' + this.composer + '\n';
    }
  });

}(musje));
