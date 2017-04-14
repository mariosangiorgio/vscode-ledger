import {tokenize} from './tokens';
import {expect} from 'chai';
import 'mocha';

describe('Tokenization', () => {
  it('should work with empty lines', () =>{
    expect(tokenize('')).to.be.empty;
  });
});