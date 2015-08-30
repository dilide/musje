/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @alias musje.Defs
   * @param {musje.Layout} layout
   */
  var Defs = musje.Defs = function (layout) {
    this._layout = layout;
  };

  musje.defineProperties(Defs.prototype,
  /** @lends musje.Defs# */
  {
    get: function (musicData) {
      var id = musicData.defId;
      return this[id] || (this[id] = this._make(id, musicData));
    },

    getAccidental: function (accidental) {
      var id = 'a' + accidental.replace(/#/g, 's');
      return this[id] ||
          (this[id] = new Defs.AccidentalDef(id, accidental, this._layout));
    },

    _make: function (id, musicData) {
      var maker = '_make' + musicData.$type;
      return this[maker](id, musicData) || { width: 0, height: 0 };
    },

    _makeBar: function (id, bar) {
      return new Defs.BarDef(id, bar, this._layout);
    },

    _makeTime: function (id, time) {
      return new Defs.TimeDef(id, time, this._layout);
    },

    _makeDuration: function (id, duration) {
      return new Defs.DurationDef(id, duration, this._layout);
    },

    _getPitch: function (id, pitch, underbar) {
      return this[id] ||
          (this[id] = new Defs.PitchDef(id, pitch, underbar, this));
    },

    _makeNote: function (id, note) {
      var
        pitch = note.pitch,
        duration = note.duration,
        underbar = duration.underbar,
        pitchId = pitch.defId + underbar,
        pitchDef = this._getPitch(pitchId, pitch, underbar),
        durationDef = this.get(duration);

      return {
        pitchDef: pitchDef,
        durationDef: durationDef,
        height: pitchDef.height,
        width: pitchDef.width + durationDef.width *
                                (underbar ? pitchDef.scale.x : 1)
      };
    },

    /**
     * Make rest is a trick to use a note with pitch.step = 0.
     * @protected
     * @param  {string} id   [description]
     * @param  {string} rest [description]
     * @return {musje.Defs.NoteDef}      [description]
     */
    _makeRest: function(id, rest) {
      return this._makeNote(id, new musje.Note({
        pitch: { step: 0 },
        duration: rest.duration
      }));
    }
  });

}(musje));
