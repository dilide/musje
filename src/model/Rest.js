/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param {rest} rest
   * @mixes musje.MusicData
   * @mixes musje.LayoutMusicData
   */
  musje.Rest = function (rest) {
    musje.extend(this, rest);
  };

  musje.defineProperties(musje.Rest.prototype,
  /** @lends musje.Rest# */
  {
    /**
     * Type of rest.
     * @type {string}
     * @constant
     * @default
     */
    $type: 'Rest',

    /**
     * Duration of the rest.
     * @type {musje.Duration}
     */
    duration: {
      get: function () {
        return this._duration || (this._duration = new musje.Duration());
      },
      set: function (duration) {
        this._duration = new musje.Duration(duration);
      }
    },

    /**
     * Convert the rest to musje source code string.
     * @return {string} Converted musje source code.
     */
    toString: function () {
      return '0' + this.duration;
    },

    toJSON: musje.makeToJSON({
      duration: undefined,
    }, 'rest')
  });

}(musje));
