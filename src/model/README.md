# model

```
Score
  - head {ScoreHead}
    - title {string}
    - composer {string}
  - parts {Array of PartwisePart}
    PartwisePart
      - measures {Cell}
  - measures {Array of TimewiseMeasure}
    TimewiseMeasure
      - parts {Cell}
      - barRight {Bar}
      - barLeft {Bar}
      - el {Element}

Cell
  - data {Array of MusicData}
  - el {Element}

MusicData {Note|Rest|Chord|Voice|Time|Bar}
  - x
  - y
  - systemX
  - width
```
