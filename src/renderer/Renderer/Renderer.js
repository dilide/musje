/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  /**
   * [Renderer description]
   * @class
   * @alias musje.Renderer
   * @param svg {string}
   * @param lo {Object}
   */
  var Renderer = musje.Renderer = function (svg, lo) {
    this._lo = musje.extend(musje.Layout.options, lo);
    this.layout = new musje.Layout(svg, this._lo);
  };

  musje.defineProperties(musje.Renderer.prototype,
  /** @lends musje.Renderer# */
  {
    render: function (score) {
      this._score = score;
      this.layout.flow(score);

      this.renderHeader();
      this.renderContent();
    },

    renderHeader: function () {
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
    },

    renderContent: function () {
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
    }

  });

  function renderNote(note, cell, lo) {
    note.el = cell.el.g().transform(Snap.matrix()
                                .translate(note.x, note.y));
    note.el.use(note.def.pitchDef.el);
    Renderer.renderDuration(note, lo);
  }

  /**
   * Render cell
   * @param  {musje.Cell} cell The cell
   * @param  {Object} lo   Layout options
   */
  musje.Renderer.renderCell = function (cell, lo) {
    cell.data.forEach(function (data) {
      switch (data.$type) {
      case 'Rest':
        renderNote(data, cell, lo);
        break;
      case 'Note':
        renderNote(data, cell, lo);
        Renderer.renderTie(data);
        Renderer.renderSlur(data);
        break;
      case 'Time':
        data.el = cell.el.use(data.def.el).attr({
          x: data.x, y: data.y
        });
        break;
      }
    });
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
