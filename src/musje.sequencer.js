
(function () {
  'use strict';

  if (!musje.Score) { return; }

  var
    AudioContext = window.AudioContext ||
      window.webkitAudioContext || window.mozAudioContext ||
      window.oAudioContext || window.msAudioContext,
    context;

  if (AudioContext) {
    // Web Audio API is available.
    context = new AudioContext();
  } else {
    // Web Audio API is not available. Ask the user to use a supported browser.
  }

  // Create a volume (gain) node
  var gainNode = context.createGain();

  //Set the volume
  gainNode.gain.value = 0.5;


  var osc = context.createOscillator();
  osc.type = 'sine';
  osc.connect(gainNode);
  gainNode.connect(context.destination);

  function playNote(time, dur, freq) {
    var osc = context.createOscillator();
    osc.type = 'sine';
    osc.connect(context.destination);
    osc.frequency.value = freq;
    osc.start(time);
    osc.stop(time + dur - 0.05);
  }

  musje.Score.prototype.play = function() {
    var measures = this.parts[0].measures,
      time = context.currentTime;

    _.each(measures, function (measure) {
      _.each(measure, function (data) {
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
