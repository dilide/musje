/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var
    extend = musje.extend,
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

  function getScale(hasAccidental, octave, underbar) {
    var absOctave = Math.abs(octave);
    return {
      x: Math.pow(0.97, absOctave + underbar + (hasAccidental ? 2 : 0)),
      y: Math.pow(0.95, absOctave + underbar + (hasAccidental ? 1 : 0))
    };
  }

  /**
   * SVG definition for pitch.
   * The `PitchDef` is defined by properties: a s o u
   * accidental step octave underbar
   * @class
   */
  musje.Defs.PitchDef = function (id, pitch, underbar, defs) {
    var
      layout = this._layout = defs._layout,
      accidental = pitch.accidental,
      octave = pitch.octave,
      scale = getScale(accidental, octave, underbar),
      el = this.el = layout.svg.el.g().attr({
        id: id,
        stroke: 'black',
        strokeWidth: 2 - (scale.x + scale.y)
      }),
      matrix,
      sbbox,
      pbbox;

    this._defs = defs;
    this._addAccidental(accidental);
    this._addStep(pitch.step);
    this._addOctave(octave);

    matrix = this._getMatrix(scale, octave, underbar);
    el.transform(matrix);

    sbbox = this._sbbox;
    sbbox = getBBoxAfterTransform(this.el, sbbox, matrix);

    pbbox = el.getBBox();
    el.toDefs();

    extend(this, {
      scale: scale,
      matrix: matrix,
      width: pbbox.width,
      height: -pbbox.y,
      stepCx: sbbox.cx,
      stepY: sbbox.y,
      stepCy: sbbox.cy,
      stepY2: sbbox.y2,
      stepTop: octave > 0 ? pbbox.y : sbbox.y + layout.options.fontSize * 0.2
    });
  };

  musje.defineProperties(musje.Defs.PitchDef.prototype,
  /** @lends musje.Defs.PitchDef# */
  {

    _addAccidental: function (accidental) {
      if (!accidental) {
        this._accidentalX2 = 0;
        return;
      }

      var
        accDef = this._defs.getAccidental(accidental);

      this.el.use(accDef.el).attr('y', -this._layout.options.accidentalShift);
      this._accidentalX2 = accDef.width;
    },

    _addStep: function (step) {
      this._sbbox = this.el
        .text(this._accidentalX2, 0, '' + step)
        .attr('font-size', this._layout.options.fontSize)
        .getBBox();
    },

    _addOctave: function (octave) {
      if (!octave) { return; }

      var
        lo = this._layout.options,
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
    },

    // Transform the pitch to be in a good baseline position and
    // scale it to be more square.
    _getMatrix: function (scale, octave, underbar) {
      var
        lo = this._layout.options,
        pbbox = this.el.getBBox(),
        dy = (octave >= 0 && underbar === 0 ? -lo.stepBaselineShift : 0) -
                              underbar * lo.underbarSep;

      return Snap.matrix()
        .translate(-pbbox.x, dy)
        .scale(scale.x, scale.y)
        .translate(0, near(pbbox.y2, this._sbbox.y2) ? 0 : -pbbox.y2);
    }

  });

}(musje, Snap));
