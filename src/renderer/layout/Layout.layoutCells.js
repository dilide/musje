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

  Layout.layoutCells = function (system, lo) {

    system.measures.forEach(function (measure) {
      measure.parts.forEach(function (cell) {
        layoutCell(cell, measure, lo);
        cell.y2 = system.height;
        cell.width = cell.minWidth;

        // cell.el.rect(0, -cell.height, cell.width, cell.height)
        //   .addClass('bbox');
      });
    });
  };

}(musje.Layout, Snap));
