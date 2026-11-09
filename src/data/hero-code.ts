/**
 * The function the hero assembles from the code field. It is the "about me".
 * Written as tokens so the syntax colouring needs no highlighter library.
 * Every value must stay true to the CV.
 */

export type TokenKind = 'keyword' | 'name' | 'key' | 'string' | 'punct' | 'space';

type Line = [TokenKind, string][];

export const heroCode: Line[] = [
  [['keyword', 'function'], ['space', ' '], ['name', 'victoriaSheveria'], ['punct', '() {']],
  [['space', '  '], ['keyword', 'return'], ['space', ' '], ['punct', '{']],
  [['space', '    '], ['key', 'role'], ['punct', ': '], ['string', "'Front-end & WordPress developer'"], ['punct', ',']],
  [['space', '    '], ['key', 'based'], ['punct', ': '], ['string', "'London'"], ['punct', ',']],
  [['space', '    '], ['key', 'builds'], ['punct', ': ['], ['string', "'fast websites'"], ['punct', ', ']],
  [['space', '      '], ['string', "'accessible interfaces'"], ['punct', ', ']],
  [['space', '      '], ['string', "'the automation behind them'"], ['punct', '],']],
  [['space', '    '], ['key', 'openToWork'], ['punct', ': '], ['keyword', 'true'], ['punct', ',']],
  [['space', '  '], ['punct', '};']],
  [['punct', '}']],
];
