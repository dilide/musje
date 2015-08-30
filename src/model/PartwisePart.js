/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param part {Object}
   * @property measures {musje.Cells}
   */
  musje.PartwisePart = function (part) {
    musje.extend(this, part);
  };

  musje.defineProperties(musje.PartwisePart.prototype,
  /** @lends musje.PartwisePart# */
  {
    // head: { $ref: '#/objects/PartHead' },

    /**
     * Measure in a partwise part is cells.
     * @type {Array.<musje.Cell>}
     */
    measures: {
      get: function () {
        return this._measures || (this._measures = []);
      },
      set: function (measures) {
        this._measures = measures.map(function (cell) {
          return new musje.Cell(cell);
        });
      }
    },

    /**
     * Convert a partwise part to sting.
     * @return {string} Musje partwise part source code.
     */
    toString: function () {
      return this.measures.map(function (cell) {
        return cell;
      }).join(' ');
    },

    toJSON: musje.makeToJSON({
      measures: undefined
    })
  });

}(musje));
