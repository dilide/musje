/*global musje, Snap*/

(function (musje, Snap) {
  'use strict';

  var
    objExtend = musje.objExtend,
    near = musje.near;

  function getBBoxAfterTransform(container, bbox, matrix) {
    var
      rect = container.rect(bbox.x, bbox.y, bbox.width, bbox.height),
      g = container.g(rect);

    rect.transform(matrix);
    bbox = g.getBBox();
    g.remove();
    return bbox;
 }

  // @constructor PitchDef
  // SVG definition for pitch.
  // The `PitchDef` is defined by properties: a s o u
  // accidental step octave underbar
  function PitchDef(id, pitch, underbar, defs) {
    var
      svg = this._svg = defs._svg,
      el = this.el = svg.g().attr('id', id),
      accidental = pitch.accidental,
      matrix,
      sbbox,
      pbbox;

    this._defs = defs;
    this._lo = defs._lo;
    this._addAccidental(accidental);
    this._addStep(pitch.step);
    this._addOctave(pitch.octave);

    matrix = this._getTransformMatrix(accidental, pitch.octave, underbar);
    el.transform(matrix);

    sbbox = this._sbbox;
    sbbox = getBBoxAfterTransform(this.el, sbbox, matrix);

    pbbox = el.getBBox();
    el.toDefs();

    objExtend(this, {
      matrix: matrix,
      width: pbbox.width,
      height: -pbbox.y,
      stepY: sbbox.y,
      stepCy: sbbox.cy,
      stepY2: sbbox.y2
    });
  }

  PitchDef.prototype._addAccidental = function (accidental) {
    if (!accidental) {
      this._accidentalEndX = 0;
      return;
    }

    var
      id = 'a' + accidental.replace(/#/g, 's'),
      defs = this._defs,
      accDef = defs[id] || (defs[id] = new musje.AccidentalDef(id, accidental, defs));

    this.el.use(accDef.el).attr('y', -this._lo.accidentalShift);
    this._accidentalEndX = accDef.width;
  };

  PitchDef.prototype._addStep = function (step) {
    this._sbbox = this.el
      .text(this._accidentalEndX, 0, '' + step)
      .attr('font-size', this._lo.fontSize)
      .getBBox();
  };

  PitchDef.prototype._addOctave = function (octave) {
    if (!octave) { return; }

    var
      lo = this._lo,
      octaveRadius = lo.octaveRadius,
      octaveOffset = lo.octaveOffset,
      octaveSep = lo.octaveSep,
      octaveEl = this.el.g(),
      i;

    if (octave > 0) {
      for (i = 0; i < octave; i++) {
        octaveEl.circle(this._sbbox.cx, this._sbbox.y + octaveOffset - octaveSep * i, octaveRadius);
      }
    } else {
      for (i = 0; i > octave; i--) {
        octaveEl.circle(this._sbbox.cx, this._sbbox.y2 - octaveOffset - octaveSep * i, octaveRadius);
      }
    }
    this.el.add(octaveEl);
  };

  // Transform the pitch to be in a good baseline position and
  // scale it to be more square.
  PitchDef.prototype._getTransformMatrix = function (hasAccidental, octave, underbar) {
    var
      lo = this._lo,
      pbbox = this.el.getBBox(),
      absOctave = Math.abs(octave);

    return Snap.matrix().translate(
        -pbbox.x,
        (octave >= 0 && underbar === 0 ? -lo.stepBaselineShift : 0) -
                            underbar * lo.underbarSep
      ).scale(
        Math.pow(0.97, absOctave + underbar + (hasAccidental ? 3 : 0)),
        Math.pow(0.95, absOctave + underbar + (hasAccidental ? 1 : 0))
      ).translate(
        0,
        near(pbbox.y2, this._sbbox.y2) ? 0 : -pbbox.y2
      );
  };

  musje.PitchDef = PitchDef;

}(musje, Snap));
