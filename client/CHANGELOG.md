### 1.0.8
Made completion a bit smarter. It now detects what kind of line it's being requested on.
This makes it possible to return either payees or accounts depending on the context.

### 1.0.7
Prevented spurios errors from appearing in the diff view

### 1.0.6
* Autocompletion for both accounts and payees
* Made path to the ledger binary file configurable

### 1.0.4
Account auto-completion

### 1.0.3
 * Ensured that the extension triggers only for ledger files
 * Started using language server

### 1.0.2
Initial implementation of file validation and reporting of malformed documents.

### 1.0.1
Fixed bug that prevented the cursor from being displayed in the correct position in the document.

### 1.0.0
Initial release. The extension is just a packaging of `Ledger.tmbundle` as a Visual Studio Code extension.
