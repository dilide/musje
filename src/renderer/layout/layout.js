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
    score.prepareTimewise();
    score.extractBars();
    score.makeBeams();

    var
      defs = this.defs,
      lo = this.options,
      measures = score.measures;

    measures.forEach(function (measure, m) {
      measure = measures[m] = new Layout.Measure(measure, lo);
      measure.parts.forEach(function (cell, c) {
        cell = measure.parts[c] = new Layout.Cell(cell, defs, lo);
        cell.flow();
      });
      measure.calcMinWidth();
    });

    this.content.flow(score.measures);
  };

}(musje));
