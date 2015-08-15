/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  function renderDots(el, x, radius, measureHeight) {
    var
      cy = measureHeight / 2,
      dy = measureHeight * 0.15;

    el.circle(x, cy - dy, radius);
    el.circle(x, cy + dy, radius);
  }

  function render(bar, measure, lo) {
    var el = measure.el.g().addClass('mus-barline');

    el.use(bar.def.el).transform(Snap.matrix().scale(1, measure.height));

    switch (bar.value) {
    case 'repeat-begin':
      renderDots(el, bar.width - lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      break;
    case 'repeat-end':
      renderDots(el, lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      break;
    case 'repeat-both':
      renderDots(el, bar.width - lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      renderDots(el, lo.barlineDotRadius, lo.barlineDotRadius, measure.height);
      break;
    }

    return el;
  }

  function translate(el, x) {
    el.transform(Snap.matrix().translate(x, 0));
  }

  // @param m {number} Measure index in measures.
  // @param len {number} Length of measures.
  musje.Renderer.renderBar = function (measure, lo) {
    var
      m = measure.m,
      len = measure.system.measures.length,
      bar = measure.barRight,
      el;

    if (bar.def) {
      el = render(bar, measure, lo);

      // Last measure in a system align end
      if (m === len - 1) {
        translate(el, measure.width - bar.width);

      // Others align middle
      } else {
        translate(el, measure.width - bar.width / 2);
      }
    }

    // First measure in a system, render right bar, align begin
    if (m === 0) {
      bar = measure.barLeft;
      if (bar.def) {
        render(bar, measure, lo);
      }
    }
  };

}(musje, Snap));
