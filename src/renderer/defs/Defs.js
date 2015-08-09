/* global musje */

(function (musje) {
  'use strict';

  // @constructor Defs
  // SVG definitions
  function Defs(svg, layoutOptions) {
    this._svg = svg;
    this._lo = layoutOptions;
  }

  Defs.prototype.get = function (musicData) {
    var id = musicData.defId;
    return this[id] || (this[id] = this._make(id, musicData));
  };

  Defs.prototype._make = function (id, musicData) {
    var
      n = musicData.__name__,
      maker = '_make' + n.charAt(0).toUpperCase() + n.substr(1);
    return this[maker](id, musicData);
  };

  Defs.prototype._makeTime = function (id, time) {
    return new musje.TimeDef(this._svg, id, time, this._lo);
  };

  Defs.prototype._makeDuration = function (id, duration) {
    return new musje.DurationDef(this._svg, id, duration, this._lo);
  };

  Defs.prototype._getPitch = function (id, pitch, underbar) {
    return this[id] ||
        (this[id] = new musje.PitchDef(id, pitch, underbar, this));
  };

  Defs.prototype._makeNote = function (id, note) {
    var
      pitch = note.pitch,
      underbar = note.duration.underbar,
      pitchId = pitch.defId + underbar,
      pitchDef = this._getPitch(pitchId, pitch, underbar),
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

  Defs.prototype._makeRest = function(id, rest) {
    var
      duration = rest.duration,
      pitchDef = this._getPitch(id, { step: 0, octave: 0 }, duration.underbar),
      durationDef = this.get(duration);

    return {
      pitchDef: pitchDef,
      durationDef: durationDef,
      height: pitchDef.height,
      width: pitchDef.width + durationDef.width
    };
  };

  musje.Defs = Defs;

}(musje));
