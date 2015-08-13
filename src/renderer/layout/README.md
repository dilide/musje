# Layout

## API Usage

```js
var layout = musje.Layout(svg, layoutOptions);
layout.flow(score);
```

## Top-level layout hierachy.

```
- Svg
  - Body
    - Header
    - Content - Systems
```

## Flow between top levels

The flow control is simply managed using ES5 getter/setter properties.

```
Properties       Set horizatally affects      Set vertically affects
--------------------------------------------------------------------------
layout.svg
          .el
          .width                                   body.width
          .height     (read-only)                       |
layout.body               ^                             |
          .el             |                             V
          .width          |                header.width & content.width
          .height     svg.height                 |              |
layout.header       ^                            |              |
          .el       |                            V              |
          .width    |                      renderHeader()       |
                    |                            |              |
          .height   |  content.y  <--------------+              |
layout.content      |      |                                    |
          .el       |      V                                    |
          .y        +- body.height                              V
          .width    |                                   content.reflow() &
                    |                                    renderContent()
          .height   +- body.height  <---------------------------+
```


## Content layout hieracy

```
- Content
  - Systems
    - System
      - Measures
        - Measure
          - barLeft
          - barRight
          - Parts
            - Cell
              - musicData
```

### Flow within content
```
systems = content.systems

system = systems[i]
          .el
          .y
          .width
          .height

measures = system[i]

measure = measures[i]
          .el
          .x
          .width
          .height

bar = measure.barLeft
    | measure.barRight
          .el
          .y
          .width
          .height
cell = measure.parts[i]
          .el
          .x
          .y
          .width
          .height

musicData = cell[i]
          .el
          .x
          .y
          .width
          .height
```