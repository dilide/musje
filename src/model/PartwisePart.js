/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param part {Object}
   * @param index {number} - Index of this part in the parts.
   * @param parts {musje.PartwiseParts}
   */
  musje.PartwisePart = function (index, parts) {

    /**
     * Index of this part in the parts.
     * @member {number}
     * @protected
     */
    this._index = index;

    /**
     * Reference to the parent parts instance.
     * @member {musje.PartwiseParts}
     */
    this.parts = parts;
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
        var
          p = this._index,
          score = this.parts.score,
          mea = this._measures = [];

        measures.forEach(function (cell, m) {
          mea.push(new musje.Cell(cell, m, p, score));
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
