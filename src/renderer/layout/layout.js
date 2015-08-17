/* global musje */

(function (musje) {
  'use strict';

  var Layout = musje.Layout = function (svg, options) {
    this.options = options;
    this.svg = svg;

    this.svg = new Layout.Svg(this);
    this.body = new Layout.Body(this);
    this.header = new Layout.Header(this);
    this.content = new Layout.Content(this);

    this.defs = new musje.Defs(this);
  };

  Layout.prototype.flow = function (score) {
    this._init(score);
    this.content.flow(score.measures);
  };

  Layout.prototype._init = function (score) {
    var
      defs = this.defs,
      lo = this.options,
      measures = score.measures;

    measures.forEach(function (measure, m) {
      measure = measures[m] = new Layout.Measure(measure, defs, lo);
      measure.parts.forEach(function (cell) {
        cell.flow(defs, lo);
      });
      measure.calcMinWidth();
    });
  };

}(musje));
