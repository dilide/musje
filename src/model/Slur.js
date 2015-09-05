/* global musje */

(function (musje) {
  'use strict';

  /**
   * Slur
   * @class
   * @param parent {musje.Note|musje.Chord}
   */
  musje.Slur = function (parent) {

    /**
     * Parent
     * @type {musje.Note|musje.Chord}
     * @readonly
     */
    this.parent = parent;
  };

  musje.defineProperties(musje.Slur.prototype,
  /** @lends musje.Slur# */
  {
    begin: '',

    end: '',

    /**
     * Previous slurred parent.
     * @type {musje.Note|musje.Chord}
     * @readonly
     */
    prevParent: {
      get: function () {
        if (!this.end) { return; }

        var prev = this.parent.prevInPart;
        while(prev) {
          if (prev.slur && !prev.slur.isEmpty) {
            return prev;
          }
          prev = prev.prevInPart;
        }
      }
    },

    /**
     * Next Slurred parent.
     * @type {musje.Note|musje.Chord}
     * @readonly
     */
    nextParent: {
      get: function () {
        if (!this.begin) { return; }

        var next = this.parent.nextInPart;
        while(next) {
          if (next.slur && !next.slur.isEmpty) {
            return next;
          }
          next = next.nextInPart;
        }
      }
    },

    /**
     * @todo
     * @type {boolean}
     * @readonly
     */
    prevCrossTie: {
      get: function () {

      }
    },

    /**
     * @todo
     * @type {boolean}
     * @readonly
     */
    nextCrossTie: {
      get: function () {

      }
    },

    /**
     * If the previous slur has error.
     * @type {boolean}
     * @readonly
     */
    prevHasError: {
      get: function () {
        var prev = this.prevParent;
        return !prev || !prev.slur.begin;
      }
    },

    /**
     * If the next slur has error.
     * @type {boolean}
     * @readonly
     */
    nextHasError: {
      get: function () {
        var next = this.nextParent;
        return !next || !next.slur.end;
      }
    },

    /**
     * If the slur is empty.
     * @type {boolean}
     * @readonly
     */
    isEmpty: {
      get: function () {
        return !(this.begin || this.end);
      }
    },

    /**
     * Convert the slur to JSON object.
     * @method
     * @return {Object} JSON object.
     */
    toJSON: musje.makeToJSON({
      begin: undefined,
      end: undefined
    })
  });

}(musje));
