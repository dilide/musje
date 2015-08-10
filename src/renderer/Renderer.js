/*global musje*/

(function (musje) {
  'use strict';

  function renderBar(systemEl, bar, lo) {
    // var
    //   x = bar.pos.x,
    //   y = bar.pos.y,
    //   y2 = y - bar.def.height;

    // switch (bar.value) {
    // case 'single':
    //   x += lo.thinBarlineWidth / 2;
    //   systemEl.line(x, y2, x, y)
    //     .attr({ strokeWidth: lo.thinBarlineWidth });
    //   x += lo.thinBarlineWidth / 2;
    //   break;
    // case 'end':
    //   x += lo.thinBarlineWidth / 2;
    //   systemEl.line(x, y2, x, y)
    //     .attr({ strokeWidth: lo.thinBarlineWidth });
    //   x += lo.thinBarlineWidth / 2 + lo.barlineSep +
    //        lo.thickBarlineWidth / 2;
    //   systemEl.line(x, y2, x, y)
    //     .attr({ strokeWidth: lo.thickBarlineWidth });
    //   x += lo.thickBarlineWidth / 2;
    //   break;
    // }
  }








  var Renderer = musje.Renderer = function (score, svg, lo) {
    this._score = score;
    this._lo = musje.objExtend(musje.layoutOptions, lo);
    this._layout = new musje.Layout(score, svg, this._lo);
  };

  Renderer.prototype.render = function () {
    var lo = this._lo, that = this;

    this._layout.flow();

    this.renderHeader();

    this._layout.systems.forEach(function (system) {
      system.measures.forEach(function (measure) {
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
            case 'bar':
              renderBar(cell.el, data, lo);
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
