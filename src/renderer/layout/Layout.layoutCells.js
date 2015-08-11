/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  // Extend layout functionality to cell.
  // @param cell {Array} An array of musicData
  function layoutCell(cell, system) {
    var x, width;

    defineProperty(cell, 'width', {
      get: function () {
        return width;
      },
      set: function (w) {
        width = w;
      }
    });

    defineProperty(cell, 'x', {
      get: function () {
        return x;
      },
      set: function (v) {
        x = v;
        cell.el.transform(Snap.matrix().translate(x, 0));
      }
    });

    cell.el = system.el.g().addClass('mus-cell');
    cell.height = system.height;
  }

  Layout.layoutCells = function (system) {
    var
      ratio = system.width / system.minWidth,
      x = 0,
      width;

    system.measures.forEach(function (measure) {
      measure.parts.forEach(function (cell) {
        layoutCell(cell, system);
        cell.x = x;
        cell.width = width = cell.minWidth * ratio;
        x += width;

        cell.el.rect(0, -cell.height, cell.width, cell.height)
          .addClass('bbox');
      });
    });
  };

}(musje.Layout, Snap));
