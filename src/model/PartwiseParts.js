/* global musje */

(function (musje) {
  'use strict';

  var properties =
  /** @lends musje.PartwiseParts */
  {

    addParts: function (parts) {
      var that = this;
      parts.forEach(function (part) {
        that.append(part);
      });
    },

    /**
     * Append a partwise part.
     * @param {Object} part - Plain partwise part object.
     */
    append: function (part) {
      var index = this.length;
      var musjePart = new musje.PartwisePart(index, this);
      this.push(musjePart);
      musjePart.measures = part.measures;
    }
  };


  /**
   * Construct partwise score parts.
   * @class
   * @classdesc Partwise score parts.
   * @param score {musje.Score}
   * @augments {Array}
   */
  musje.PartwiseParts = function (score) {

    var parts = [];

    /**
     * Reference to the parent score.
     * @memberof musje.PartwiseParts#
     * @alias score
     * @type {musje.Score}
     */
    parts.score = score;
    musje.defineProperties(parts, properties);
    return parts;
  };

}(musje));
