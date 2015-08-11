/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  // var Cell = Layout.Cell = function (system) {
  //   var
  //     xOffset = 0,
  //     ratio = system.width / system.minWidth,
  //     width;

  //   this.el = system.el.g()
  //     .transform(Snap.matrix().translate(xOffset, 0))
  //     .addClass('mus-cell');
  //   this.height = system.height;
  //   // this.width = cell.minWidth * ratio;
  //   xOffset += width;
  // };

  function makeCells(system) {
    var
      xOffset = 0,
      ratio = system.width / system.minWidth,
      width;

    system.measures.forEach(function (measure) {
      measure.parts.forEach(function (cell) {
        cell.el = system.el.g()
          .transform(Snap.matrix().translate(xOffset, 0))
          .addClass('mus-cell');
        cell.height = system.height;
        width = cell.width = cell.minWidth * ratio;
        xOffset += width;

        cell.el.rect(0, -cell.height, cell.width, cell.height)
          .addClass('bbox');
      });
    });
  }

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
          case 'bar':
            x += lo.measurePaddingRight - lo.musicDataSep;
            data.pos = { x: x, y: 0 };
            data.def = { height: 25 };
            x += lo.measurePaddingLeft;
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
    var score = this._score;

    score.prepareTimewise();
    score.extractBars();
    score.makeBeams();
    this.setMusicDataDef();
    this.setMinDimensionOfCells();
    this.setMinWidthOfMeasures();

    this.makeSystems();
    this.layoutSystems();
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

  Layout.prototype.layoutSystems = function () {
    var lo = this._lo;
    this.systems.forEach(function (system) {
      makeCells(system);
      layoutMusicData(system, lo);
    });
  };

}(musje, Snap));
