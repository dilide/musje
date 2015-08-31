/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var Renderer = musje.Renderer = function (svg, lo) {
    this._lo = musje.extend(musje.Layout.options, lo);
    this.layout = new musje.Layout(svg, this._lo);
  };

  Renderer.prototype.render = function (score) {
    this._score = score;
    this.layout.flow(score);

    this.renderHeader();
    this.renderContent();
  };

  Renderer.prototype.renderHeader = function () {
    var
      lo = this._lo,
      header = this.layout.header,
      el = header.el,
      width = header.width;

    el.text(width / 2, lo.titleFontSize, this._score.head.title)
      .attr({
        fontSize: lo.titleFontSize,
        fontWeight: lo.titleFontWeight,
        textAnchor: 'middle'
      });
    el.text(width, lo.titleFontSize * 1.5, this._score.head.composer)
      .attr({
        fontSize: lo.composerFontSize,
        fontWeight: lo.composerFontWeight,
        textAnchor: 'end'
      });

    header.height = el.getBBox().height;
  };

  Renderer.prototype.renderContent = function () {
    var lo = this._lo;

    this.layout.content.systems.forEach(function (system) {
      var measures = system.measures;
      measures.forEach(function (measure) {
        Renderer.renderBar(measure, lo);
        measure.parts.forEach(function (cell) {
          Renderer.renderCell(cell, lo);
        });
      });
    });
  };

  function renderNote(note, cell, lo) {
    note.el = cell.el.g().transform(Snap.matrix()
                                .translate(note.x, note.y));
    note.el.use(note.def.pitchDef.el);
    Renderer.renderDuration(note, lo);
  }

  Renderer.renderCell = function (cell, lo) {
    cell.data.forEach(function (data) {
      switch (data.$type) {
      case 'Rest':
        renderNote(data, cell, lo);
        break;
      case 'Note':
        renderNote(data, cell, lo);
        Renderer.renderTie(data);
        break;
      case 'Time':
        data.el = cell.el.use(data.def.el).attr({
          x: data.x, y: data.y
        });
        break;
      }
    });
  };

  function getTiePath(x1, y1, x2, y2) {
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

  Renderer.renderTie = function (note) {
    var
      next = note.tie.next,
      prev = note.tie.prev,
      system = note.cell.measure.system,
      noteDx,
      tiePath,
      x1, x2, y1, y2;

    // Tie end
    if (prev && prev.cell.measure.system !== system) {
      x1 = note.def.pitchDef.stepCx;
      y1 = note.def.pitchDef.stepTop;
      x2 = - note.systemX - 3;
      tiePath = note.el.path(getTiePath(x1, y1, x2, y1 - 3));
    }

    if (next) {
      x1 = note.def.pitchDef.stepCx;
      y1 = note.def.pitchDef.stepTop;

      // Tie begin
      if (next.cell.measure.system !== system) {
        x2 = system.width - note.systemX + 3;
        tiePath = note.el.path(getTiePath(x1, y1, x2, y1 - 3));

      // Tie complete
      } else {
        noteDx = next.systemX - note.systemX;
        x2 = next.def.pitchDef.stepCx;
        y2 = next.def.pitchDef.stepTop;
        tiePath = note.el.path(getTiePath(x1, y1, noteDx + x2, y2));
      }
    }

    if (tiePath && note.tie.error) {
      tiePath.addClass('mus-error');
    }
  };


  /**
   * Render the score in jianpu (numbered musical notation).
   * @member
   * @function
   * @param {string} svg
   * @param {Object} lo - Layout options.
   */
  musje.Score.prototype.render = function (svg, lo) {
    new Renderer(svg, lo).render(this);
  };

}(musje, Snap));
