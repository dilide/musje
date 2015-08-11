/* global musje */

(function (musje) {
  'use strict';

  function layoutMusicData(system, lo) {
    system.measures.forEach(function (measure) {
      measure.parts.forEach(function (cell) {
        var x = 0;
        cell.forEach(function (data) {
          switch (data.__name__) {
          case 'rest':  // fall through
          case 'note':
            data.pos = { x: x, y: 0 };
            x += data.def.width + lo.musicDataSep;
            break;
          case 'time':
            data.pos = { x: x, y: 0 };
            x += data.def.width + lo.musicDataSep;
            break;
          }
        });
      });
    });
  }

  var Layout = musje.Layout = function (score, svg, lo) {
    this._score = score;
    this._lo = lo;

    this.svg = new Layout.Svg(svg, lo);
    this.body = new Layout.Body(this.svg, lo);
    this.header = new Layout.Header(this, lo);
    this.content = new Layout.Content(this.body, this.header, lo);
  };

  Layout.prototype.flow = function () {
    var score = this._score, lo = this._lo;

    score.prepareTimewise();
    score.extractBars();
    score.makeBeams();
    this.setMusicDataDef();
    this.setMinDimensionOfCells();
    this.setMinWidthOfMeasures();

    this.systems = new Layout.Systems(score, this.content, lo);

    // TODO: to be cleaned up...
    this.systems.forEach(function (system) {
      system.layoutMeasures();
      Layout.layoutCells(system, lo);
      layoutMusicData(system, lo);
    });
  };

  Layout.prototype.setMusicDataDef = function () {
    var defs = new musje.Defs(this.svg.el, this._lo);

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
    this._score.measures.forEach(function (measure) {
      var minWidth = 0;
      measure.parts.forEach(function (cell) {
        minWidth = Math.max(minWidth, cell.minWidth);
      });
      measure.minWidth = minWidth;
    });
  };

}(musje));
