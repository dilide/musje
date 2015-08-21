/* global musje */

(function (musje) {
  'use strict';

  var
    extend = musje.extend,
    near = musje.near;

  function getBeamedGroups(cell, groupDur) {
    var counter = 0, group = [], groups = [];

    function inGroup() {
      return counter < groupDur && !near(counter, groupDur);
    }
    function putGroup() {
      if (group.length > 1) { groups.push(group); }
      group = [];
    }

    cell.data.forEach(function (musicData) {
      if (musicData.$name !== 'Note' && musicData.$name !== 'Rest') {
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

  // @param cell {Array} either a measure in a part, or a part in a measure.
  // @param groupDur {number} Duration of a beam group in quarter.
  function makeBeams(cell, groupDur) {

    getBeamedGroups(cell, groupDur).forEach(function (group) {
      // beamLevel starts from 0 while underbar starts from 1
      var beamLevel = {};

      function nextHasSameBeamlevel(index, level) {
        var next = group[index + 1];
        return next && next.duration.underbar > level;
      }

      group.forEach(function(musicData, i) {
        var
          underbar = musicData.duration.underbar,
          level;
        for (level = 0; level < underbar; level++) {
          if (nextHasSameBeamlevel(i, level)) {
            musicData.beams = musicData.beams || {};
            if (beamLevel[level]) {
              musicData.beams[level] = 'continue';
            } else {
              beamLevel[level] = true;
              musicData.beams[level] = 'begin';
            }
          } else {
            if (beamLevel[level]) {
              musicData.beams = musicData.beams || {};
              musicData.beams[level] = 'end';
              delete beamLevel[level];
            }
          }
        }
      });
    });
  }

  function linkCellData(cell) {
    cell.data.forEach(function (data, d) {
      data.cell = cell;
      data.index = d;
      if (data.pitch) {
        data.pitch.note = data;
      }
    });
  }

  extend(musje.Score.prototype, {

    init: function () {
      this.prepareTimewise();
      this.extractBars();
      this.prepareCells();
      this.linkTies();
      return this;
    },

    // A cell is identically a measure in a part or a part in a measure.
    walkCells: function (callback) {
      this.parts.forEach(function (part, p) {
        part.measures.forEach(function (cell, m) {
          callback(cell, m, p);
        });
      });
    },
    walkMusicData: function (callback) {
      this.walkCells(function (cell, m, p) {
        cell.data.forEach(function (data, d) {
          callback(data, d, m, p);
        });
      });
    },

    prepareTimewise: function () {
      var measures = this.measures = [];
      this.walkCells(function (cell, m, p) {
        measures[m] = measures[m] || [];
        var measure = measures[m];
        measure.parts = measure.parts || [];
        measure.parts[p] = cell;
      });
    },

    // Extract bars in each cell out into the measure.
    extractBars: function () {
      var measures = this.measures;
      measures.forEach(function (measure, m) {
        measure.parts.forEach(function (cell) {
          var
            data = cell.data,
            len = data.length;
          if (!len) { return; }

          // barRight
          if (len && data[len - 1].$name === 'Bar') {
            measure.barRight = data.pop();
          }

          // barLeft
          if (data[0] && data[0].$name === 'Bar') {
            measure.barLeft = data.shift();
          } else {
            if (m !== 0) {
              measure.barLeft = measures[m - 1].barRight;
            }
          }
        });
      });
    },

    prepareCells: function () {
      this.walkCells(function (cell) {
        linkCellData(cell);
        makeBeams(cell, 1);
      });
    },

    linkTies: function () {
      var prev = null;

      this.walkMusicData(function (data) {
        var tie;

        if (data.$name === 'Note') {
          tie = data.tie;
          data.tie = {};
          if (prev) {
            data.tie.prev = prev;
            prev.tie.next = data;
          }
          prev = tie ? data : null;
        }
      });
    }

  });

}(musje));
