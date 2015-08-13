/* global musje */

(function (musje) {
  'use strict';

  // @constructor Defs
  // SVG definitions
  var Defs = musje.Defs = function (svg, layoutOptions) {
    this._svg = svg;
    this._lo = layoutOptions;
  };

  Defs.prototype.get = function (musicData) {
    var id = musicData.defId;
    return this[id] || (this[id] = this._makeDef(id, musicData));
  };

  Defs.prototype._makeDef = function (id, musicData) {
    var
      n = musicData.__name__,
      maker = '_make' + n.charAt(0).toUpperCase() + n.substr(1) + 'Def';
    return this[maker](id, musicData);
  };

  Defs.prototype._makeBarDef = function (id, bar) {
    return new Defs.BarDef(this._svg, id, bar, this._lo);
  };

  Defs.prototype._makeTimeDef = function (id, time) {
    return new Defs.TimeDef(this._svg, id, time, this._lo);
  };

  Defs.prototype._makeDurationDef = function (id, duration) {
    return new Defs.DurationDef(this._svg, id, duration, this._lo);
  };

  Defs.prototype._getPitchDef = function (id, pitch, underbar) {
    return this[id] ||
        (this[id] = new Defs.PitchDef(id, pitch, underbar, this));
  };

  Defs.prototype._makeNoteDef = function (id, note) {
    var
      pitch = note.pitch,
      underbar = note.duration.underbar,
      pitchId = pitch.defId + underbar,
      pitchDef = this._getPitchDef(pitchId, pitch, underbar),
      durationDef = this.get(note.duration);

    return {
      pitchDef: pitchDef,
      durationDef: durationDef,
      height: pitchDef.height,
      width: pitchDef.width + durationDef.width,
      minWidth: pitchDef.width + durationDef.minWidth,
      maxWidth: pitchDef.width + durationDef.maxWidth
    };
  };

  // Rest does not have its only RestDef class.
  // It is just a trick to use a note with pitch.step = 0.
  Defs.prototype._makeRestDef = function(id, rest) {
    var
      duration = rest.duration,
      pitchDef = this._getPitchDef(id, { step: 0, octave: 0 }, duration.underbar),
      durationDef = this.get(duration);

    return {
      pitchDef: pitchDef,
      durationDef: durationDef,
      height: pitchDef.height,
      width: pitchDef.width + durationDef.width
    };
  };

}(musje));
