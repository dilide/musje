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
   */
  musje.Cell = function (cell) {
    musje.extend(this, cell);
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
        this._data = data.map(function (datum) {
          switch(Object.keys(datum)[0]) {
          case 'note':
            return new musje.Note(datum.note);
          case 'rest':
            return new musje.Rest(datum.rest);
          case 'chord':
            return new musje.Chord(datum.chord);
          case 'voice':
            return new musje.Voice(datum.voice);
          case 'bar':
            return new musje.Bar(datum.bar);
          case 'time':
            return new musje.Time(datum.time);
          default:
            throw new Error('Unknown music data: ' + datum);
          }
        });
      }
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
