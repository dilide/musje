/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Content = Layout.Content = function (layout) {
    this._layout = layout;
    this.el = layout.body.el.g().addClass('mus-content');
    this.width = layout.body.width;

    var system = new Layout.System(this, layout.options);
    system.y = 0;
    system.height = 25;
    this.systems = [system];
  };

  Content.prototype._resizeBody = function () {
    var
      layout = this._layout,
      headerHeight = layout.header.height;

    layout.body.height = this.height +
            (headerHeight ? headerHeight + layout.options.headerSep : 0);
  };

  // Divide measures in timewise score into the systems.
  // Assign y, height, minWdith, and measures to each system.
  Content.prototype.flow = function (scoreMeasures) {
    var
      content = this,
      lo = this._layout.options,
      systems = this.systems,
      system = systems[0],
      width = content.width,
      height = 25,
      s = 0,
      x = 0;

    function y() {
      return s * (height + lo.systemSep);
    }

    scoreMeasures.forEach(function (measure) {
      x += measure.minWidth + lo.measurePaddingRight;

      // Continue putting this measure in the system.
      if (x < width) {
        measure.system = system;
        system.measures.push(measure);
        system.minWidth = x;
        x += lo.measurePaddingLeft;

      // New system
      } else {
        s++;
        system = systems[s] = new Layout.System(content, lo);
        system.y = y();
        system.height = height;
        measure.system = system;
        system.measures.push(measure);
        x = measure.minWidth + lo.measurePaddingRight;
      }
    });

    content.height = y() + height;

    systems.forEach(function (system) {
      system.flow();
    });
  };

  defineProperty(Content.prototype, 'y', {
    get: function () {
      return this._y;
    },
    set: function (y) {
      this._y = y;
      this.el.transform(Snap.matrix().translate(0, y));
      this._resizeBody();
    }
  });

  defineProperty(Content.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(Content.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
      this._resizeBody();
    }
  });

}(musje.Layout, Snap));
