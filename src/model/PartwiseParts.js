/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param parts {Array}
   * @param score {musje.Score}
   */
  musje.PartwiseParts = function (score) {
    this.score = score;

    /**
     * Array value of the partwise parts.
     * @member {Array}
     * @readonly
     */
    this.value = [];

  };

  musje.defineProperties(musje.PartwiseParts.prototype,
  /** @lends musje.PartwiseParts# */
  {

    at: function (index) {
      return this.value[index];
    },

    addParts: function (parts) {
      var that = this;
      parts.forEach(function (part) {
        that.append(part);
      });
    },

    /**
     * Append a partwise part.
     * @param  {Object} part - Plain partwise part object.
     */
    append: function (part) {
      var index = this.value.length;
      var musjePart = new musje.PartwisePart(index, this);
      this.value.push(musjePart);
      musjePart.measures = part.measures;
    },

    toJSON: function () {
      return this.value;
    }
  });

}(musje));
