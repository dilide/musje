/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  function renderCell (cell, lo) {
    cell.data.forEach(function (data, i) {
      switch (data.$name) {
      case 'Rest':  // fall through
      case 'Note':
        data.el = cell.el.g().transform(Snap.matrix()
                                .translate(data.x, data.y));
        data.el.use(data.def.pitchDef.el);
        Renderer.renderDuration(data, i, cell, lo);
        break;
      case 'Time':
        data.el = cell.el.use(data.def.el).attr({
          x: data.x, y: data.y
        });
        break;
      }
    });
  }


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
          renderCell(cell, lo);
        });
      });
    });
  };


  musje.Score.prototype.render = function (svg, lo) {
    new Renderer(svg, lo).render(this);
  };

}(musje, Snap));
