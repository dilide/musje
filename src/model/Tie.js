/* global musje */

(function (musje) {
  'use strict';

  /**
   * Tie of the note.
   * @class
   * @param {boolean} tie - Whether the note tie to the next note.
   */
  musje.Tie = function (tie) {
    /** @member */
    this.value = tie;
  };

  musje.defineProperties(musje.Tie.prototype,
  /** @lends musje.Tie# */
  {
    toJSON: function () {
      return this.value;
    }
  });

}(musje));
