/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param {Object} note
   * @mixes musje.MusicData
   * @mixes musje.LayoutMusicData
   */
  musje.Note = function (note) {
    musje.extend(this, note);

    /**
     * Reference to the parent parent.
     * @memberof musje.Pitch#
     * @alias parent
     * @type {musje.MusicData}
     * @readonly
     */
    this.pitch.parent = this;
  };

  musje.defineProperties(musje.Note.prototype,
  /** @lends musje.Note.prototype */
  {
    /**
     * Type of note.
     * @type {string}
     * @constant
     * @default
     */
    $type: 'Note',

    /**
     * Pitch of the note.
     * @type {musje.Pitch}
     */
    pitch: {
      get: function () {
        return this._pitch || (this._pitch = new musje.Pitch());
      },
      set: function (pitch) {
        this._pitch = new musje.Pitch(pitch);
      }
    },

    /**
     * Duration of the note.
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

    beams: {
      get: function () {
        return this._beams || (this._beams = []);
      },
      set: function (beams) {
        this._beams = beams;
      }
    },

    /**
     * Tie
     * @type {musje.Tie}
     */
    tie: {
      get: function () {
        return this._tie || (this._tie = new musje.Tie(this));
      },
      set: function (tie) {

        /**
         * Value of the tie.
         * @memberof musje.Tie#
         * @alias value
         * @type {boolean}
         */
        this.tie.value = tie;
      }
    },

    /**
     * Slur
     * @type {musje.Slur}
     */
    slur: {
      get: function () {
        return this._slur || (this._slur = new musje.Slur(this));
      },
      set: function (slur) {
        musje.extend(this.slur, slur);
      }
    },

    /** @method */
    toString: function () {
      return this.slur.begin + this.pitch + this.duration +
             this.slur.end + this.tie.value;
    },

    toJSON: musje.makeToJSON({
      pitch: undefined,
      duration: undefined,
      tie: undefined,
      slur: undefined
    }, 'note')
  });

}(musje));
