'use strict';
export class Position{
  constructor(readonly line: number, readonly column: number){}
}

export enum TokenType{
  Separator,
  Date,
  Identifier
}

export class Token{
  constructor(
    readonly tokenType: TokenType,
    readonly lexeme: string,
    readonly position: Position){}
}

export function tokenize(text: string) : Token[]{
  return []
}