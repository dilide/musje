/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var BAR_TO_ID = {
    single: 'bs', double: 'bd', end: 'be',
    'repeat-begin': 'brb', 'repeat-end': 'bre', 'repeat-both': 'brbe'
  };

  function renderDots(el, x, radius, measureHeight) {
    var
      cy = measureHeight / 2,
      dy = measureHeight * 0.15;

    el.circle(x, cy - dy, radius);
    el.circle(x, cy + dy, radius);
  }

  function render(bar, measure, defs) {
    var
      lo = defs._layout.options,
      def,
      el;

    bar.defId = BAR_TO_ID[bar.value];
    def = defs.get(bar);

    el = measure.el.g().addClass('mus-barline');

    el.use(def.el).transform(Snap.matrix().scale(1, measure.height));

    switch (bar.value) {
    case 'repeat-begin':
      renderDots(el, def.width - lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      break;
    case 'repeat-end':
      renderDots(el, lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      break;
    case 'repeat-both':
      renderDots(el, def.width - lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      renderDots(el, lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      break;
    }

    return {
      el: el,
      def: def
    };
  }

  function translate(el, x) {
    el.transform(Snap.matrix().translate(x, 0));
  }

  // @param m {number} Measure index in measures.
  // @param len {number} Length of measures.
  musje.Renderer.renderBar = function (measure, m, len, defs) {
    var
      bar = measure.barRight,
      result, el, def;

    if (m === len - 1) {
      if (bar.value === 'repeat-begin') {
        bar = new musje.Bar('single');
      } else if (bar.value === 'repeat-both') {
        bar = new musje.Bar('repeat-end');
      }
    }

    result = render(bar, measure, defs);
    el = result.el;
    def = result.def;

    if (m === len - 1) {
      translate(el, measure.width - def.width);
    } else {
      translate(el, measure.width - def.width / 2);
    }

    if (m === 0) {
      bar = measure.barLeft;
      if (bar.value === 'repeat-both') {
        render(new musje.Bar('repeat-begin'), measure, defs);
      } else if (bar.value === 'repeat-end') {
        render(new musje.Bar('single'), measure, defs);

      } else {
        render(measure.barLeft, measure, defs);
      }
    }
  };

}(musje, Snap));
