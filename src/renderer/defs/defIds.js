/* global musje, Snap */

(function (musje) {
  'use strict';

  var BAR_TO_ID = {
    single: 'bs', double: 'bd', end: 'be',
    'repeat-begin': 'brb', 'repeat-end': 'bre', 'repeat-both': 'brbe'
  };

  var defIds = {

    /**
     * Def id used in the SVG <defs> element.
     * ```
     * id := 't' beats '-' beatType
     * ```
     * E.g. `t3-4`
     * @member
     * @alias musje.Time#defId
     * @type {string}
     * @readonly
     */
    Time: function () {
      return ['t', this.beats, '-', this.beatType].join('');
    },

    /**
     * Def id used in the SVG <defs> element.
     * ```
     * defId    Bar value
     * ----------------------
     * 'bs'   - single
     * 'bd'   - double
     * 'be'   - repeat-end
     * 'brb'  - repeat-begin
     * 'bre'  - repeat-end
     * 'brbe' - repeat-both
     * ```
     * @member
     * @alias musje.Bar#defId
     * @type {string}
     * @readonly
     */
    Bar: function () {
      return BAR_TO_ID[this.value];
    },

    /**
     * Unique def id of the note used in the SVG <defs> element.
     * ```
     * defId := 'n' accidental step octave type dot
     * ```
     * E.g.
     * ```
     * Note     defId
     * ------------------
     * 1        n1040
     * b3-      nb3020
     * #5'_.    ns5181
     * 6,,      n6-2
     * ```
     * @member
     * @alias musje.Note#defId
     * @type {string}
     * @readonly
     */
    Note: function () {
      var pitch = this.pitch, duration = this.duration;
      return [
        'n', pitch.accidental.replace(/#/g, 's'),
        pitch.step, pitch.octave, duration.type, duration.dot
      ].join('');
    },

    /**
     * Unique def id of the rest used in the SVG <defs> element.
     * ```
     * defId := 'r' type dot
     * ```
     * E.g.
     * ```
     * Rest     defId
     * ----------------
     * 0        r40
     * 0 -      r20
     * 0=.      r161
     * ```
     *
     * @member
     * @alias musje.Rest#defId
     * @type {string}
     * @readonly
     */
    Rest: function () {
      var duration = this.duration;
      return 'r' + duration.type + duration.dot;
    },

    /**
     * Def id used in the SVG <defs> element.
     * ```
     * defId := 'p' accidental step octave
     * ```
     * @member
     * @alias musje.Pitch#defId
     * @type {string}
     * @readonly
     */
    Pitch: function () {
      return ['p', this.accidental.replace(/#/g, 's'),
                   this.step, this.octave].join('');
    },

    /**
     * Def id used in the SVG <defs> element.
     * ```
     * defId := 'd' type dot
     * ```
     * *E.g.*
     * ```
     * Note     defId
     * ----------------
     * 1.       d41
     * 1_       d80
     * 1=       d160
     * 1-..     d22
     * ```
     * @member
     * @alias musje.Duration#defId
     * @type {string}
     * @readonly
     */
    Duration: function () {
      return 'd' + this.type + this.dot;
    }
  };

  musje.objEach(defIds, function (getter, className) {
    Object.defineProperty(musje[className].prototype, 'defId', {
      get: getter
    });
  });

}(musje, Snap));
