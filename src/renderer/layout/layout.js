/* global musje */

(function (musje) {
  'use strict';

  var Layout = musje.Layout = function (svg, lo) {
    this._lo = lo;

    this.svg = new Layout.Svg(svg, lo);
    this.body = new Layout.Body(this.svg, lo);
    this.header = new Layout.Header(this, lo);
    this.content = new Layout.Content(this.body, this.header, lo);

    this.defs = new musje.Defs(this.svg.el, this._lo);
  };

  Layout.prototype.flow = function (score) {
    this._score = score;

    score.prepareTimewise();
    score.extractBars();
    score.makeBeams();
    this.setMusicDataDef();
    this.setMinDimensionOfCells();
    this.setMinWidthOfMeasures();

    this.content.flow(score.measures);
  };

  Layout.prototype.setMusicDataDef = function () {
    var defs = this.defs;

    this._score.walkMusicData(function (data) {
      switch (data.__name__) {
      case 'rest':  // fall through
      case 'note':
        data.def = defs.get(data);
        break;
      case 'time':
        data.def = defs.get(data);
        break;
      default:
        data.def = { width: 0, height: 0 };
      }
    });
  };

  Layout.prototype.setMinDimensionOfCells = function () {
    var lo = this._lo;
    this._score.walkCells(function (cell) {
      var x = 0, minHeight;
      cell.forEach(function (musicData) {
        x += musicData.def.width + lo.musicDataSep;
        minHeight = Math.min(minHeight, musicData.def.height);
      });
      cell.minWidth = x;
      cell.minHeight = minHeight;
    });
  };

  Layout.prototype.setMinWidthOfMeasures = function () {
    var
      lo = this._lo,
      padding = lo.measurePaddingLeft + lo.measurePaddingRight;

    this._score.measures.forEach(function (measure) {
      var minWidth = 0;
      measure.parts.forEach(function (cell) {
        minWidth = Math.max(minWidth, cell.minWidth);
      });
      measure.minWidth = minWidth + padding;
    });
  };

}(musje));
