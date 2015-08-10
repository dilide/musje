/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

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
    this._svg = svg;
    this._lo = lo;
    this.flow();
  };

  Layout.prototype.flow = function () {
    var score = this._score;

    this.makeSvg();
    this.makeBody();
    this.renderHeader();
    this.makeContent();

    score.prepareTimewise();
    score.extractBars();
    score.makeBeams();
    this.setMusicDataDef();
    this.setMinDimensionOfCells();
    this.setMinWidthOfMeasures();

    this.makeSystems();
    this.layoutSystems();
  };

  Layout.prototype.makeSvg = function () {
    var lo = this._lo;

    this._svg = Snap(this._svg).attr({
      fontFamily: lo.fontFamily,
      width: lo.width,
      height: lo.height
    });
    this._svg.clear();
  };

  Layout.prototype.makeBody = function () {
    var lo = this._lo;
    this.body = {
      el: this._svg.g()
          .transform(Snap.matrix().translate(lo.marginLeft, lo.marginTop))
          .addClass('mus-body'),
      width: lo.width - lo.marginLeft - lo.marginRight,
      height: lo.height - lo.marginTop - lo.marginBottom
    };
  };

  Layout.prototype.renderHeader = function () {
    var
      lo = this._lo,
      el = this.body.el.g().addClass('mus-header'),
      width = this.body.width;

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

    this.header = {
      el: el,
      width: width,
      height: el.getBBox().height
    };
  };

  Layout.prototype.makeContent = function () {
    var
      body = this.body,
      yOffset = this.header.height + this._lo.headerSep;

    this.content = {
      el: body.el.g()
          .transform(Snap.matrix().translate(0, yOffset))
          .addClass('mus-content'),
      width: body.width,
      height: body.height - yOffset
    };
  };

  Layout.prototype.setMusicDataDef = function () {
    var defs = new musje.Defs(this._svg, this._lo);

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
