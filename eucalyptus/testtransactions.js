"use strict";

function makeTree() {
  var t = new AccountTree("accounts");

  t.clearAccounts();
  t.resetBalances();
  
  t.addAccount("assets", "Assets", "accounts");
  t.addAccount("bank", "Banks", "assets");
  t.addAccount("bradesco", "Bradesco", "bank");
  t.addAccount("itau", "Itaú", "bank");
  t.addAccount("caixa", "Caixa Economica Federal", "bank");
  t.addAccount("santander", "Santander", "bank");
  t.addAccount("wal", "Wallets", "assets");
  t.addAccount("front", "Front", "wal");
  t.addAccount("back", "Back", "wal");

  t.addAccount("itcor", "Conta Corrente", "itau");
  t.addAccount("brcor", "Conta Corrente", "bradesco");

  t.addAccount("expenses", "Expenses", "accounts");
  t.addAccount("groc", "Groceries", "expenses");
  t.addAccount("pao", "Pao de Acucar", "groc");
  t.addAccount("merc", "Mercadinho", "groc");
  t.addAccount("stm", "St. Marche", "groc");
  t.addAccount("extra", "Extra", "groc");
  t.addAccount("dia", "Dia", "groc");
  t.addAccount("self", "Self-care", "expenses");
  t.addAccount("health", "Health", "self");
  t.addAccount("body", "Body", "health");
  t.addAccount("hair", "Hair", "body");

  t.addAccount("hsbc", "HSBC", "bank");

  t.addAccount("income", "Income", "accounts");
  t.addAccount("salary", "Salary", "income");

  t.addAccount("equity", "Equity", "accounts");
  t.addAccount("open", "Opening Balance", "equity");
  t.addAccount("saved", "Saved", "open");

  t.addAccount("liabilities", "Liabilities", "accounts");
  t.addAccount("credit", "Credit Card", "liabilities");

  return t;
}

// ["0 accounts",
//  "1 assets",
//   "2 bank",
//    "3 bradesco",
//     "4 brcor",
//    "3 itau", "4 itcor",
//    "3 caixa", "3 santander", "3 hsbc",
//   "2 wal",
//    "3 front", "3 back",
//  "1 expenses",
//   "2 groc",
//    "3 pao", "3 merc", "3 stm", "3 extra", "3 dia",
//   "2 self",
//    "3 health",
//     "4 body",
//      "5 hair"]

QUnit.test("Add transaction", function(assert) {
  var t = makeTree();
  
  t.recordTransaction({ timestamp: 0, description: "pass go", amount: 20000, debit: "bank", credit: "open" });
  console.log(t.getAccount("assets"));
  assert.equal(t.getAccount("assets").balance, 20000);
  
});

