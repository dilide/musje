/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @alias musje.Layout
   * @param svg {string}
   * @param options {Object} Layout options
   */
  var Layout = musje.Layout = function (svg, options) {
    this.options = options;
    this.svg = svg;

    this.svg = new Layout.Svg(this);
    this.body = new Layout.Body(this);
    this.header = new Layout.Header(this);
    this.content = new Layout.Content(this);

    this.defs = new musje.Defs(this);
  };

  /**
   * @param  {musje.Score} score
   */
  Layout.prototype.flow = function (score) {
    this._init(score);
    this.content.flow(score.measures);
  };

  /**
   * @param  {musje.Score} score
   * @protected
   */
  Layout.prototype._init = function (score) {
    var
      layout = this,
      measures = score.measures;

    measures.forEach(function (measure, m) {
      measure = measures[m];
      measure.layout = layout;
      measure.parts.forEach(function (cell) {
        cell.layout = layout;
        cell.flow();
      });
      measure.calcMinWidth();
    });
  };

}(musje));
