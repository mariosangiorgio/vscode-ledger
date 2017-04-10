import {CompletionOracle} from './autocomplete';
import {expect} from 'chai';
import 'mocha';

describe('Autocomplete', () => {
  let accounts = new Set<string>(["A", "B"])
  let payees = new Set<string>(["p", "q"])
  let oracle = new CompletionOracle(accounts, payees)

  it('should return accounts for empty lines', () => {
    let result = oracle.complete("")
    expect(result).to.contain("A")
    expect(result).to.contain("B")
  });

  it('should return payees when starting with a date', () => {
    let result = oracle.complete("2017/04/10")
    expect(result).to.contain("p")
    expect(result).to.contain("q")
  });
});