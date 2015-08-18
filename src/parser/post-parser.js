
  musje.parse = function (input) {
    var plainScore = parser.parse(input);
    return musje.score(plainScore);
  };

}(musje));
