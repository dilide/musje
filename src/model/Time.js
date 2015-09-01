/* global musje */

(function (musje) {
  'use strict';

  /**
   * Time signature.
   * @class
   * @param time {Object}
   * @mixes musje.MusicData
   * @mixes musje.LayoutMusicData
   */
  musje.Time = function (time) {
    musje.extend(this, time);
  };

  musje.defineProperties(musje.Time.prototype,
  /** @lends musje.Time# */
  {
    /**
     * Type of time.
     * @type {string}
     * @constant
     * @default
     */
    $type: 'Time',

    /**
     * How many beats per measure.
     * @type {number}
     * @default
     */
    beats: 4,

    /**
     * Beat type
     * @type {number}
     * @default
     */
    beatType: 4,

    /**
     * Convert to musje source code.
     * @return {string} Musje source code.
     */
    toString: function () {
      return this.beats + '/' + this.beatType;
    },

    toJSON: musje.makeToJSON({
      beats: 4,
      beatType: 4
    }, 'time')
  });

}(musje));
