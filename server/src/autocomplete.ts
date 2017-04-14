export class Completion{
  constructor(readonly label: string, readonly insertText: string){}
}

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

  complete(line: string) : Completion[]{
    function toArray(strings: Set<string>, prefix: number) : Completion[]{
      let result = []
      strings.forEach(item =>
        result.push(new Completion(item, item.substring(prefix))));
      return result;
    }
    //TODO: compute the lenght of the prefix that is already present
    return this.isTransactionHeader(line)
      ? toArray(this.payees, 0)
      : toArray(this.accounts, 0)
  }
}
