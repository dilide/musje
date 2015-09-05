/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  function getCurvePath(x1, y1, x2, y2) {
    var
      dx = x2 - x1,
      dy = y2 - y1,
      c1x = 0,//-0.1 * dx,
      c1y = 0,//-0.1 * dy,
      c2x = dx,//1.1 * dx,
      c2y = dy;//1.1 * dy;

    return Snap.format('M{x1},{y1}c{c1x},{c1y} {c2x},{c2y} {dx},{dy}c{c3x},{c3y} {c4x},{c4y} {negDx},{negDy}', {
      x1: x1,
      y1: y1,
      c1x: c1x,
      c1y: c1y - 8,
      c2x: c2x,
      c2y: c2y - 8,
      dx: dx,
      dy: dy,
      c3x: -c1x,
      c3y: -c1y - 10,
      c4x: -c2x,
      c4y: -c2y - 10,
      negDx: -dx,
      negDy: -dy
    });
  }

  function renderEndCurve(note, error) {
    var
      x1 = note.def.pitchDef.stepCx,
      y1 = note.def.pitchDef.stepTop,
      x2 = - note.systemX - 3,
      el = note.el.path(getCurvePath(x1, y1, x2, y1 - 3));

    if (error) { el.addClass('mus-error'); }
    return el;
  }

  function renderBeginCurve(note, error) {
    var
      x1 = note.def.pitchDef.stepCx,
      y1 = note.def.pitchDef.stepTop,
      x2 = note.system.width - note.systemX + 3,
      el = note.el.path(getCurvePath(x1, y1, x2, y1 - 3));

    if (error) { el.addClass('mus-error'); }
    return el;
  }

  function renderCompleteCurve(note1, note2, error) {
    var
      x1 = note1.def.pitchDef.stepCx,
      y1 = note1.def.pitchDef.stepTop,
      x2 = note2.def.pitchDef.stepCx,
      y2 = note2.def.pitchDef.stepTop,
      noteDx = note2.systemX - note1.systemX,
      el = note1.el.path(getCurvePath(x1, y1, noteDx + x2, y2));

    if (error) { el.addClass('mus-error'); }
    return el;
  }

  function renderCurve(type, note) {
    var next, prev, prevHasError, nextHasError;

    if (note[type].end) {
      prev = note[type].prevParent;
      prevHasError = note[type].prevHasError;

      if (!prev || prev.system !== note.system) {
        renderEndCurve(note, prevHasError);
      } else if (prevHasError) {
        renderCompleteCurve(note, prev, prevHasError);
      }
    }

    if (note[type].begin) {
      next = note[type].nextParent;
      nextHasError = note[type].nextHasError;

      if (!next || next.system !== note.system) {
        renderBeginCurve(note, nextHasError);
      } else {
        renderCompleteCurve(note, next, nextHasError);
      }
    }
  }

  /**
   * Render tie.
   * @param  {musje.Note} note
   */
  musje.Renderer.renderTie = function (note) {
    renderCurve('tie', note);
  };

  /**
   * Render slur.
   * @param  {musje.Note} note
   */
  musje.Renderer.renderSlur = function (note) {
    renderCurve('slur', note);
  };

}(musje, Snap));
