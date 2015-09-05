/* global musje */

(function (musje) {
  'use strict';

  /**
   * Tie of the note.
   * @class
   * @param parent {musje.Note|musje.Chord}
   */
  musje.Tie = function (parent) {

    /**
     * Parent
     * @type {musje.Note|musje.Chord}
     * @readonly
     */
    this.parent = parent;
  };

  musje.defineProperties(musje.Tie.prototype,
  /** @lends musje.Tie# */
  {
    value: '',

    /**
     * @readonly
     */
    begin: {
      get: function () {
        return this.value;
      }
    },

    /**
     * @readonly
     */
    end: {
      get: function () {
        return this.prevParent;
      }
    },

    /**
     * The previous durable music data in part, if it is a tie begin.
     * @type {musje.Durable|undefined}
     * @readonly
     */
    prevParent: {
      get: function () {
        var prev = this.parent.prevDurableInPart;
        return prev && prev.tie && prev.tie.value && prev;
      }
    },

    /**
     * The next durable music data in part.
     * @type {musje.Durable|undefined}
     * @readonly
     */
    nextParent: {
      get: function () {
        return this.value && this.parent.nextDurableInPart;
      }
    },

    /**
     * If previous durable music data in part has error.
     * @type {boolean}
     * @readonly
     */
    prevHasError: {
      get: function () {
        var prev = this.prevParent;
        if (!prev || !prev.pitch) { return true; }
        return prev.pitch && prev.pitch.midiNumber !== this.parent.pitch.midiNumber;
      }
    },

    /**
     * If next durable music data in part has error.
     * @type {boolean}
     * @readonly
     */
    nextHasError: {
      get: function () {
        var next = this.nextParent;
        if (!next || !next.pitch) { return true; }
        return next.pitch.midiNumber !== this.parent.pitch.midiNumber;
      }
    },

    toJSON: function () {
      return this.value;
    }
  });

}(musje));
