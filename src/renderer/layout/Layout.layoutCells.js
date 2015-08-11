/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  // Extend layout functionality to cell.
  // @param cell {Array} An array of musicData
  function layoutCell(cell, measure, lo) {
    var y2, width;

    defineProperty(cell, 'width', {
      get: function () {
        return width;
      },
      set: function (w) {
        width = w;
      }
    });

    defineProperty(cell, 'y2', {
      get: function () {
        return y2;
      },
      set: function (v) {
        y2 = v;
        cell.el.transform(Snap.matrix().translate(cell.x, y2));
      }
    });

    cell.el = measure.el.g().addClass('mus-cell');
    cell.x = lo.measurePaddingRight;
    cell.height = measure.height;
  }


  function layoutMeasure(measure, system) {
    var x, width;

    defineProperty(measure, 'width', {
      get: function () {
        return width;
      },
      set: function (w) {
        width = w;
      }
    });

    defineProperty(measure, 'x', {
      get: function () {
        return x;
      },
      set: function (v) {
        x = v;
        measure.el.transform(Snap.matrix().translate(x, 0));
      }
    });

    measure.el = system.el.g().addClass('mus-measure');
    measure.height = system.height;
  }

  Layout.layoutCells = function (system, lo) {
    var
      ratio = system.width / system.minWidth,
      x = 0;

    system.measures.forEach(function (measure) {
      layoutMeasure(measure, system);
      measure.parts.forEach(function (cell) {
        layoutCell(cell, measure, lo);
        measure.x = x;
        cell.y2 = system.height;
        cell.width = cell.minWidth * ratio;
        measure.width = cell.width + lo.measurePaddingRight + lo.measurePaddingLeft;
        x += measure.width;

        // cell.el.rect(0, -cell.height, cell.width, cell.height)
        //   .addClass('bbox');
      });
      // measure.el.rect(0, 0, measure.width, measure.height)
      //     .attr({ stroke: 'green', fill: 'none' });
    });
  };

}(musje.Layout, Snap));
