import completions from '../src/autocomplete';
import { expect } from 'chai';
import 'mocha';

describe('Hello function', () => {
  it('should return hello world', () => {
    const result = completions();
    expect(result).to.equal('Hello World!');
  });
});