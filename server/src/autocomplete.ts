export class CompletionOracle {
  constructor(
    readonly accounts: Set<string>,
    readonly payees: Set<string>){
    }

  // Heuristic to decide whether we're dealing with the fist
  // line of a transaction (it starts with a date) or with
  // the lines including the amount associated to a given account.
  // It expects the user to have already inserted the date before
  // invoking auto-completion.
  private isTransactionHeader(line: string) : Boolean {
      return /^\d+/.test(line.trim())
  }

  complete(line: string) : string[]{
    function toArray(strings: Set<string>) : string[]{
      let result = []
      strings.forEach(account => result.push(account));
      return result;
    }
    return this.isTransactionHeader(line) ? toArray(this.payees) : toArray(this.accounts)
  }
}
