/*global musje*/

(function () {
  'use strict';

  if (!musje.Score) { return; }

  var audioCtx = new window.AudioContext();
  var gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = 0.5;  // set the volume

  // var oscillator = audioCtx.createOscillator();
  // oscillator.connect(gainNode);
  // oscillator.type = 'square'; // sine | square | sawtooth | triangle | custom

  function playNote(time, dur, freq) {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(audioCtx.destination);
    oscillator.frequency.value = freq;
    oscillator.start(time);
    oscillator.stop(time + dur - 0.05);
  }

  musje.Score.prototype.play = function() {
    var measures = this.parts[0].measures,
      time = audioCtx.currentTime;

    measures.forEach(function (measure) {
      measure.forEach(function (data) {
        var freq, dur;

        switch (data.__name__) {
        case 'note':
          freq = data.pitch.frequency;
          dur = data.duration.second;
          console.log('Play: ' + data, time, dur, freq);
          playNote(time, dur, freq);
          time += dur;
          break;
        case 'rest':
          time += data.duration.second;
          break;
        }
      });
    });
  };
}());
