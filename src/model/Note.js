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
     * Reference to the parent note.
     * @memberof musje.Pitch#
     * @alias note
     * @type {musje.Note}
     */
    this.pitch.note = this;
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

    /**
     * Tie
     * @type {musje.Tie}
     */
    tie: {
      get: function () {
        return this._tie || (this._tie = new musje.Tie());
      },
      set: function (tie) {
        this._tie = new musje.Tie(tie);
      }
    },

    /**
     * Slurs attached to the note.
     * @type {Array.<musje.Slur>}
     */
    slurs: {
      get: function () {
        return this._slurs;
      },
      set: function (slurs) {
        this._slurs = slurs.map(function (slur) {
          return new musje.Slur(slur);
        });
      }
    },

    /** @method */
    toString: function () {
      return this.pitch + this.duration;
    },

    toJSON: musje.makeToJSON({
      pitch: undefined,
      duration: undefined,
      tie: undefined,
      slurs: undefined
    }, 'note')
  });

}(musje));
