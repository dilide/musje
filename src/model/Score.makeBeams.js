/* global musje */

(function (musje) {
  'use strict';

  var near = musje.near;

  function getBeamedGroups(cell, groupDur) {
    var counter = 0, group = [], groups = [];

    function inGroup() {
      return counter < groupDur && !near(counter, groupDur);
    }
    function putGroup() {
      if (group.length > 1) { groups.push(group); }
      group = [];
    }

    cell.forEach(function (musicData) {
      if (musicData.__name__ !== 'note' && musicData.__name__ !== 'rest') {
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

  musje.Score.prototype.makeBeams = function () {
    this.walkCells(function (cell) {
      makeBeams(cell, 1);
    });
  };

}(musje));
