/* description: Musje 123 language */

%{
  // Polyfill
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/gm, '');
    };
  }

  function lastItem(arr) { return arr[arr.length - 1]; }

  function extend(target, ext) {
    for (var key in ext) { target[key] = ext[key]; }
    return target;
  }

  function onlyProperty(obj) {
    for (var key in obj) {}
    return obj[key];
  }

  function octave(str) {
    var len = str.length;
    return str.charAt(0) === ',' ? -len : len;
  }

  function removeLastEmptyMeasure(score) {
    var parts = score.parts,
      lastMeasure;
    for (i = 0; i < parts.length; i++) {
      lastMeasure = lastItem(parts[i].measures);
      if (lastMeasure.length === 0) {
        parts[i].measures.pop();
      }
    }
  }
%}

/* lexical grammar */
%lex
%x time title

S             [ \t]
NL            [\n\r]
ACCIDENTAL    "#"{1,2}|"n"|"b"{1,2}
HALF          " "*"-"" "*
SMALL_INT     [1-9]\d{0,2}
BEATS         {SMALL_INT}\/

%%
/* Comments */
\/\/[^\n]*              return 'S'
\/\*([\s\S]*?)\*\/      return 'S'
\/\*[\s\S]*             return 'S'

"<<<"                   { this.begin('title'); }
<title>.*">>>"          { yytext = yytext.substr(0, yyleng - 3).trim();
                          return 'TITLE'; }
<title>{S}*{NL}         { this.begin('INITIAL'); }
<title>.*               { this.begin('INITIAL');
                          yytext = yytext.trim();
                          return 'COMPOSER'; }

{BEATS}                 { this.begin('time');
                          yytext = yytext.substr(0, yyleng - 1);
                          return 'BEATS'; }
<time>{SMALL_INT}[^\d]  { this.begin('INITIAL'); return 'BEAT_TYPE'; }

{ACCIDENTAL}            return 'ACCIDENTAL'
[1-7]                   return 'STEP'
","+|"'"+               return 'OCTAVE'
"."+                    return 'DOT'
{HALF}{3}               return 'WHOLE'
{HALF}                  return 'HALF'
" "*"~"                 return 'TIE'

[_]                     return '_'
"="                     return '='
"."                     return '.'
[0]                     return '0'
"<"                     return '<'
">"                     return '>'
"("                     return '('
")"                     return ')'
\/                      return '/'
"\\"                    return '\\'
"|]"                    return '|]'
"||"                    return '||'
"[|"                    return '[|'
"|:"                    return '|:'
":|:"                   return ':|:'
":|"                    return ':|'
"|"                     return '|'
"{"                     return '{'
"}"                     return '}'
":"                     return ':'

{NL}                    return 'NL'
{S}                     return 'S'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

%start e

%% /* Musje grammar rules */
e
  : maybe_musje EOF
    { return $1; }
  ;

maybe_musje
  : %empty
    { $$ = null; }
  | space maybe_space
    { $$ = null; }
  | space maybe_space musje
    { $$ = $3; removeLastEmptyMeasure($3); }
  | musje
    { $$ = $1; removeLastEmptyMeasure($1); }
  ;

space
  : S
  | NL
  ;

maybe_space
  : %empty
  | maybe_space S
  | maybe_space NL
    { $$ = $1 ? $1 + 1 : 1; }     // Count newlines
  ;

musje
  : score_head
    { $$ = { head: $1 }; }
  | part_list
    { $$ = { parts: $1 }; }
  | score_head part_list
    { $$ = { head: $1, parts: $2 }; }
  ;

score_head
  : title maybe_space
  ;

title
  : 'TITLE'
    { $$ = { title: $1 }; }
  | 'TITLE' 'COMPOSER'
    { $$ =  { title: $1, composer: $2 }; }
  ;

part_list
  : part
    { $$ = [$1]; }
  ;

part
  : measure_list
    { $$ = { measures: $1}; }
  | bar maybe_space measure_list
    { $$ = { measures: $3}; $3[0].unshift({ bar: $1 }); }
  ;

measure_list
  : measure
    { $$ = [$1]; }
  | measure_list bar maybe_space measure
    { $$ = $1; lastItem($1).push({ bar: $2 }); $1.push($4); }
  | measure_list bar maybe_space
    { $$ = $1; lastItem($1).push({ bar: $2 }); $1.push([]); }
  ;

measure
  : music_data maybe_space
    { $$ = [$1]; }
  | measure music_data maybe_space
    { $$ = $1; $1.push($2); }
  ;

bar
  : '|'
    { $$ = 'single'; }
  | '||'
    { $$ = 'double'; }
  | '|]'
    { $$ = 'end'; }
  // | '[|'
  | '|:'
    { $$ = 'repeat-begin'; }
  | ':|'
    { $$ = 'repeat-end'; }
  | ':|:'
    { $$ = 'repeat-both'; }
  ;

music_data
  : slurable
  | slurable TIE
    { $$ = $1; onlyProperty($1).duration.tie = true; }
  | '0' maybe_duration
    { $$ = { rest: { duration: $2 } }; }
  | voice
    { $$ = { voice: $1 }; }
  | time_signature
  ;

slurable
  : pitchful maybe_duration
    { $$ = $1; onlyProperty($1).duration = $2; }
  | '(' pitchful maybe_duration
    {
      $$ = $2;
      extend(onlyProperty($2), {
        duration: $3,
        slur: ['begin']
      });
    }
  | pitchful maybe_duration ')'
    {
      $$ = $1;
      extend(onlyProperty($1), {
        duration: $2,
        slur: ['end']
      });
    }
  ;

pitchful
  : note
    { $$ = { note: $1 }; }
  | chord
    { $$ = { chord: $1 }; }
  ;

note
  : pitch
    { $$ = { pitch: $1 }; }
  ;

pitch
  : STEP
    { $$ = { step: +$1 }; }
  | STEP OCTAVE
    { $$ = { step: +$1, octave: octave($2) }; }
  | ACCIDENTAL STEP
    { $$ = { accidental: $1, step: +$2 }; }
  | ACCIDENTAL STEP OCTAVE
    { $$ = { accidental: $1, step: +$2, octave: octave($3) }; }
  ;

maybe_duration
  : %empty
    { $$ = { type: 4 }; }
  | type_modifier
    { $$ = { type: $1 }; }
  | DOT
    { $$ = { type: 4, dot: $1.length }; }
  | type_modifier DOT
    { $$ = { type: $1, dot: $2.length }; }
  ;

type_modifier
  : '_'
    { $$ = 8; }
  | '='
    { $$ = 16; }
  | '=' '_'
    { $$ = 32; }
  | '=' '='
    { $$ = 64; }
  | '=' '=' '_'
    { $$ = 128; }
  | '=' '=' '='
    { $$ = 256; }
  | 'HALF'
    { $$ = 2; }
  | 'WHOLE'
    { $$ = 1; }
  ;

chord
  : '<' pitch_list '>'
    { $$ = { pitches: $2 }; }
  ;

pitch_list
  : pitch
    { $$ = [$1]; }
  | pitch_list pitch
    { $$ = $1; $1.push($2); }
  ;

voice
  : '{' voice_list '}'
    { $$ = $2; }
  ;

voice_list
  : voice_data_list
    { $$ = [$1]; }
  | voice_data_list ':' voice_data
    { $$ = $1; $1.push($2); }
  ;

// TODO
voice_data
  : slurable
  | restslurable_list slurable
    { $$ = $1; $1.push($2); }
  ;

time_signature
  : BEATS BEAT_TYPE
    { $$ = { time: { beats: +$1, beatType: +$2 } }; }
  ;
