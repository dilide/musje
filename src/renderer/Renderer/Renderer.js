/* global musje */

(function (musje) {
  'use strict';

  function renderCell (cell, lo) {
    cell.data.forEach(function (data, i) {
      switch (data.__name__) {
      case 'rest':  // fall through
      case 'note':
        data.el = cell.el.use(data.def.pitchDef.el).attr({
          x: data.x, y: data.y
        });
        Renderer.renderDuration(data, i, cell, lo);
        break;
      case 'time':
        data.el = cell.el.use(data.def.el).attr({
          x: data.x, y: data.y
        });
        break;
      }
    });
  }


  var Renderer = musje.Renderer = function (svg, lo) {
    this._lo = musje.objExtend(musje.Layout.options, lo);
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

}(musje));
