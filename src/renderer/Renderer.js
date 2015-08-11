/*global musje*/

(function (musje) {
  'use strict';

  function renderBar(measure, lo) {
    var
      bar = measure.rightBar,
      measureEl = measure.el,
      x = measure.width,
      y = 0,
      y2 = measure.height;

    switch (bar.value) {
    case 'single':
      x -= lo.thinBarlineWidth / 2;
      measureEl.line(x, y2, x, y)
        .attr({ strokeWidth: lo.thinBarlineWidth });
      break;
    case 'end':
      x -= lo.thickBarlineWidth / 2;
      measureEl.line(x, y2, x, y)
        .attr({ strokeWidth: lo.thickBarlineWidth });
      x -= lo.thinBarlineWidth / 2 + lo.barlineSep +
           lo.thickBarlineWidth / 2;
      measureEl.line(x, y2, x, y)
        .attr({ strokeWidth: lo.thinBarlineWidth });
      break;
    }
  }


  var Renderer = musje.Renderer = function (score, svg, lo) {
    this._score = score;
    this._lo = musje.objExtend(musje.Layout.options, lo);
    this._layout = new musje.Layout(score, svg, this._lo);
  };

  Renderer.prototype.render = function () {
    var lo = this._lo, that = this;

    this._layout.flow();

    this.renderHeader();

    this._layout.systems.forEach(function (system) {
      system.measures.forEach(function (measure) {

        renderBar(measure, lo);

        measure.parts.forEach(function (cell) {
          cell.forEach(function (data, dataIdx) {
            switch (data.__name__) {
            case 'rest':  // fall through
            case 'note':
              data.el = cell.el.use(data.def.pitchDef.el).attr(data.pos);
              that.renderDuration(data, dataIdx, cell);
              break;
            case 'time':
              data.el = cell.el.use(data.def.el).attr(data.pos);
              break;
            }
          });
        });
      });
    });
  };

  Renderer.prototype.renderHeader = function () {
    var
      lo = this._lo,
      header = this._layout.header,
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

  musje.Score.prototype.render = function (svg, lo) {
    new Renderer(this, svg, lo).render();
  };

}(musje));
