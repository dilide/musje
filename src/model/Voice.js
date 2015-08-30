/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param {Object} voice
   */
  musje.Voice = function (voice) {
    musje.extend(this, voice);
  };

  musje.defineProperties(musje.Voice.prototype,
  /** @lends musje.Voice# */
  {
    /**
     * Convert the voice to musje source code string.
     * @return {string} Converted musje source code string.
     */
    toString: function () {

    }
  });

}(musje));
