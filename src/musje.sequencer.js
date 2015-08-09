/*global musje,MIDI*/

(function (musje, MIDI) {
  'use strict';

  if (!musje.Score) { return; }

  if (window.AudioContext) {
    var audioCtx = new window.AudioContext();
    var gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.5;  // set the volume
  }

  // var oscillator = audioCtx.createOscillator();
  // oscillator.connect(gainNode);
  // oscillator.type = 'square'; // sine | square | sawtooth | triangle | custom

  function playNote(time, dur, freq) {
    if (!audioCtx) { return; }

    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(audioCtx.destination);
    oscillator.frequency.value = freq;
    oscillator.start(time);
    oscillator.stop(time + dur - 0.05);
  }

  function midiPlayNote(note, time) {
    var
      midiNumber = note.pitch.midiNumber,
      dur = note.duration.second;

    function play() {
      MIDI.noteOn(0, midiNumber, 100, 0);
      MIDI.noteOff(0, midiNumber, dur);
      console.log('Play: ' + note, time, dur, midiNumber);
    }

    return setTimeout(play, time * 800);
  }

  var timeouts = [];

  musje.Score.prototype.play = function() {
    var
      measures = this.parts[0].measures,
      time = 0; //audioCtx.currentTime

    measures.forEach(function (measure) {
      measure.forEach(function (data) {
        switch (data.__name__) {
        case 'note':
          // playNote(time, dur, freq);
          timeouts.push(midiPlayNote(data, time));
          time += data.duration.second;
          break;
        case 'rest':
          time += data.duration.second;
          break;
        }
      });
    });
  };

  musje.Score.prototype.stop = function () {
    timeouts.forEach(function (timeout) {
      clearTimeout(timeout);
    });
    timeouts = [];
  };

}(musje, MIDI));
