# model

```
Score
  - head {ScoreHead}
  - parts {Array of PartwisePart}
    PartwisePart
      - measures {Cell}
  - measures {Array of TimewiseMeasure}
    TimewiseMeasure
      - parts {Cell}

Cell
  - data {Array of MusicData}

MusicData {Note|Rest|Chord|Voice|Time|Bar}
```
