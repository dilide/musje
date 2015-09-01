/* global musje */

(function (musje) {
  'use strict';

  var near = musje.near;

  function getBeamGroups(cell, groupDur) {
    var counter = 0, group = [], groups = [];

    function inGroup() {
      return counter < groupDur && !near(counter, groupDur);
    }
    function putGroup() {
      if (group.length > 1) { groups.push(group); }
      group = [];
    }

    cell.data.forEach(function (musicData) {
      if (musicData.$type !== 'Note' && musicData.$type !== 'Rest') {
        return;
      }
      var
        duration = musicData.duration,
        dur = duration.quarter;

      counter += dur;

      if (inGroup()) {
        if (duration.underbar) { group.push(musicData); }
      } else if (near(counter, groupDur)) {
        group.push(musicData);
        putGroup();
        counter = 0;
      } else {
        putGroup();
        counter %= groupDur;
      }
    });
    putGroup();

    return groups;
  }

  /**
   * Construct a cell.
   * Cell is either a measure in a partwise part, or
   * a part in a timewise measure.
   * @class
   * @param cell {Object}
   * @param mIndex {number} - Measure index of this cell.
   * @param pIndex {number} - Part index of this cell.
   * @mixes musje.LayoutCell
   */
  musje.Cell = function (cell, mIndex, pIndex, score) {

    /**
     * Measure index of this cell.
     * @member {number}
     * @protected
     */
    this._mIndex = mIndex;

    /**
     * Part index of this cell.
     * @member {number}
     * @protected
     */
    this._pIndex = pIndex;

    /**
     * Reference to the root score instance.
     * @member {musje.Score}
     * @readonly
     */
    this.score = score;

    musje.extend(this, cell);

    this.makeBeams(1);
  };

  musje.defineProperties(musje.Cell.prototype,
  /** @lends musje.Cell# */
  {
    /**
     * Music data
     * @type {Array.<musje.MusicData>}
     */
    data: {
      get: function () {
        return this._data || (this._data = []);
      },
      set: function (data) {
        var that = this;
        that.length = 0;
        data.forEach(function (datum) {
          that.append(datum);
        });
      }
    },

    /**
     * Reference to the parent measures.
     * @type {musje.TimewiseMeasures}
     * @readonly
     */
    measures: {
      get: function () {
        return this.score.measures;
      }
    },

    /**
     * Reference to the parent measure.
     * @type {musje.TimewiseMeasure}
     * @readonly
     */
    measure: {
      get: function () {
        return this.measures[this._mIndex];
      }
    },

    /**
     * Reference to the parent parts.
     * @type {musje.PartwiseParts}
     * @readonly
     */
    parts: {
      get: function () {
        return this.score.parts;
      }
    },

    /**
     * Reference to the parent part.
     * @type {musje.PartwisePart}
     * @readonly
     */
    part: {
      get: function () {
        return this.parts[this._pIndex];
      }
    },

    /**
     * Previous cell in the part.
     * @type {musje.Cell|undefined}
     * @readonly
     */
    prev: {
      get: function () {
        return this.part.measures[this._mIndex - 1];
      }
    },

    firstData: {
      get: function () {
        return this.data[0];
      }
    },

    lastData: {
      get: function () {
        return this.data[this.data.length - 1];
      }
    },

    /**
     * The left bar of this cell.
     * @type {musje.Bar|undefined}
     * @readonly
     */
    barLeft: {
      get: function () {
        var firstData = this.firstData;

        if (firstData && firstData.$type === 'Bar') {
          return firstData;
        }

        // Take from the previous measure.
        var prevCell = this.prev;
        if (prevCell) {
          return prevCell.barRight;
        }
      }
    },

    /**
     * The right bar of this cell.
     * @type {musje.Bar|undefined}
     * @readonly
     */
    barRight: {
      get: function () {
        var lastData = this.lastData;

        if (lastData && lastData.$type === 'Bar') {
          return lastData;
        }
      }
    },

    /**
     * Append a music data to the cell.
     * @param  {Object} musicData - Music data
     */
    append: function (musicData) {
      var
        name = Object.keys(musicData)[0],
        className = name[0].toUpperCase() + name.substr(1),
        instance = new musje[className](musicData[name]);

      /**
       * Reference to the parent cell
       * @memberof musje.MusicData#
       * @alias cell
       * @type {musje.Cell}
       * @readonly
       */
      instance.cell = this;

      /**
       * Index of the music data in the cell
       * @memberof musje.MusicData#
       * @alias _index
       * @type {number}
       * @protected
       */
      instance._index = this.data.length;

      this.data.push(instance);
    },

    /**
     * Convert cell to string.
     * @return {string} Converted cell in musje source code.
     */
    toString: function () {
      return this.data.map(function (musicData) {
        return musicData.toString();
      }).join(' ');
    },

    toJSON: musje.makeToJSON({
      data: undefined
    }),

    /**
     * Make beams automatically in group by the groupDur.
     * @param {number} groupDur - Duration of a beam group in quarter.
     */
    makeBeams: function (groupDur) {

      getBeamGroups(this, groupDur).forEach(function (group) {
        // beamLevel starts from 0 while underbar starts from 1
        var beamLevel = {};

        function nextHasSameBeamlevel(index, level) {
          var next = group[index + 1];
          return next && next.duration.underbar > level;
        }

        group.forEach(function(data, i) {
          var
            underbar = data.duration.underbar,
            level;

          for (level = 0; level < underbar; level++) {
            if (nextHasSameBeamlevel(i, level)) {

              /**
               * Beams of the note.
               * - Produced by the {@link musje.Cell#makeBeams} method.
               * - The above method is call in {@link musje.Score#prepareCells}.
               * @memberof musje.Note#
               * @alias beams
               * @type {Array.<musje.Beam>}
               */
              data.beams = data.beams || [];
              if (beamLevel[level]) {
                data.beams[level] = new musje.Beam('continue', level, data);
              } else {
                beamLevel[level] = true;
                data.beams[level] = new musje.Beam('begin', level, data);
              }
            } else {
              if (beamLevel[level]) {
                data.beams = data.beams || [];
                data.beams[level] = new musje.Beam('end', level, data);
                delete beamLevel[level];
              }
            }
          }
        });
      });
    }

  });

}(musje));
