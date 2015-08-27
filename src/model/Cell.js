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

  function Beam(value, level, note) {
    this.value = value;
    this.level = level;
    this.note = note;
  }
  Beam.prototype.endNote = function () {
    var
      begin = this.note.index,
      cell = this.note.cell,
      i = begin + 1,
      next = cell.data[i];

    while (next && next.beams && next.beams[this.level].value !== 'end') {
      i++;
      next = cell.data[i];
    }
    return next;
  };


  // @param groupDur {number} Duration of a beam group in quarter.
  musje.Cell.prototype.makeBeams = function (groupDur) {

    getBeamedGroups(this, groupDur).forEach(function (group) {
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
              musicData.beams[level] = new Beam('continue', level, musicData);
            } else {
              beamLevel[level] = true;
              musicData.beams[level] = new Beam('begin', level, musicData);
            }
          } else {
            if (beamLevel[level]) {
              musicData.beams = musicData.beams || {};
              musicData.beams[level] = new Beam('end', level, musicData);
              delete beamLevel[level];
            }
          }
        }
      });
    });
  };

}(musje));
