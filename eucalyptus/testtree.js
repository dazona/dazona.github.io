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

QUnit.test("Get account and check for nonexistent", function(assert) {
  var t = makeTree();
  assert.ok(t.getAccount("bank"));
  assert.ok(t.getAccount("nothing") === null);
});

QUnit.test("Get immediate children of accounts", function(assert) {
  var t = makeTree();
  var accountsChildren = t.immediateChildren("accounts");
  assert.equal(accountsChildren.length, 5);
});

QUnit.test("Get all children of an account", function(assert) {
  var t = makeTree();
  var selfChildren = t.children("self");
  
  // does not contain banks
  assert.ok(selfChildren.indexOf("bradesco") === -1);

  // immediate child
  assert.ok(selfChildren.indexOf("health") !== -1);
  
  // deeper level
  assert.ok(selfChildren.indexOf("hair") !== -1);
});

QUnit.test("First child of a parent", function(assert) {
  var t = makeTree();
  assert.equal(t.firstChild("accounts"), "assets");
  assert.equal(t.firstChild("bank"), "bradesco");
  assert.equal(t.firstChild("body"), "hair");
});

QUnit.test("Last child of a parent", function(assert) {
  var t = makeTree();
  assert.equal(t.lastChild("body"), "hair");
  assert.equal(t.lastChild("bank"), "hsbc");
  assert.equal(t.lastChild("accounts"), "liabilities");
});

QUnit.test("Find next account", function(assert) {
  var t = makeTree();
  assert.equal(t.nextSibling("bradesco"), "itau");
  assert.equal(t.nextSibling("hsbc"), null);
  assert.equal(t.nextSibling("assets"), "expenses");
});

QUnit.test("Move account at same level", function(assert) {
  var t = makeTree();

  // move to front of level
  t.moveTo("caixa", "bank", "");  
  assert.equal(t.firstChild("bank"), "caixa");  

  // move to same location
  var flatBefore = t.flatten();
  t.moveTo("stm", "groc", "merc");
  var flatAfter = t.flatten();
  assert.equal(JSON.stringify(flatBefore), JSON.stringify(flatAfter));

  // move to end of list
  t.moveTo("merc", "groc", "dia");
  assert.equal(t.lastChild("groc"), "merc");
});

QUnit.test("Move account to topmost level", function(assert) {
  var t = makeTree();

  // move to first item at topmost level
  t.moveTo("back", t.rootId, "");
  var toplevelAccounts = t.immediateChildren(t.rootId);
  assert.ok(toplevelAccounts.indexOf("back") !== -1);
  assert.equal(t.firstChild(t.rootId), "back");
  
  // move to last item at topmost level
  t.moveTo("bradesco", t.rootId, t.lastChild(t.rootId));
  assert.equal(t.lastChild(t.rootId), 'bradesco');
  
  // move to middle of topmost level
  t.moveTo("income", t.rootId, "assets");
  var f = t.flatten();

  assert.ok(f.indexOf("1 income") > f.indexOf("1 assets"));
});

QUnit.test("Move to different branch", function(assert) {
  var t = makeTree();

  // move to first item of different branch
  t.moveTo("merc", "bank", "");
  assert.equal(t.firstChild("bank"), 'merc');

  // move to last item of different branch
  t.moveTo("dia", "bank", "hsbc");
  assert.equal(t.lastChild("bank"), "dia");
  
  // move to middle of different branch
  t.moveTo("pao", "bank", "caixa");
  var f = t.flatten();
  assert.ok(f.indexOf("3 pao") > f.indexOf("3 caixa"));
  
  // move to new singleton leaf
  t.moveTo("stm", "hair", "");
  assert.equal(t.firstChild("hair"), "stm");
  assert.equal(t.lastChild("hair"), "stm");

  // remove leaf and add as new leaf
  t.moveTo("brcor", "stm", "");
  assert.equal(t.firstChild("stm"), 'brcor');

  // remove leaf and move to middle of new branch
  t.moveTo("itcor", "groc", "extra");
  var c = t.children("groc");
  assert.ok(c.indexOf("itcor") > -1);

  var f = t.flatten();
});

QUnit.test("Display flat list", function(assert) {
  var t = makeTree();
  var bt = t.buildTree();
  var f = t.flatten();

  assert.equal(f[0], "0 accounts");
  assert.equal(f[f.length-1], "2 credit");
  assert.ok(f.indexOf("3 bradesco") < f.indexOf("3 hsbc"));

  // altering structure requires rebuilding
  t.moveTo("bradesco", "bank", "hsbc");
  f = t.flatten();
  assert.ok(f.indexOf("3 bradesco") > f.indexOf("3 hsbc"));
});

QUnit.test("Display as tree", function(assert) {
  var t = makeTree();
  t.moveTo("bradesco", "bank", "hsbc");
  var bt = t.buildTree();
  // console.log(JSON.stringify(bt, null, 2));
  assert.equal(bt.children[0].id, "assets");
  var bank = bt.children[0].children[0].children;
  assert.equal(bank[bank.length - 1].id, "bradesco");
  function countNodes(rootNode) {
    var nodes = 1;
    function recurse(node) {
      var children = node.children;
      for (var i = 0, len = children.length; i < len; i++) {
        nodes += 1;
        recurse(children[i]);
      }
    }
    recurse(rootNode);
    return nodes;
  }
  
  assert.equal(countNodes(bt), Object.keys(t.accounts).length);
});

QUnit.test("Account is child of another", function(assert) {
  var t = makeTree();
  assert.ok(t.isChildOf("bradesco", "bank"));
  assert.ok(!t.isChildOf("hair", "income"));
  assert.ok(t.isChildOf("hair", "accounts"));
  assert.ok(t.isChildOf("assets", "accounts"));
  assert.ok(!t.isChildOf("assets", "bank"));
  assert.ok(!t.isChildOf("assets", "assets"));
});

QUnit.test("Account belongs to another", function(assert) {
  var t = makeTree();
  assert.ok(t.belongsTo("bradesco", "bank"));
  assert.ok(!t.belongsTo("hair", "income"));
  assert.ok(t.belongsTo("hair", "accounts"));
  assert.ok(t.belongsTo("assets", "accounts"));
  assert.ok(!t.belongsTo("assets", "bank"));
  assert.ok(t.belongsTo("assets", "assets"));
});

QUnit.test("Account is ancestor of another", function(assert) {
  var t = makeTree();
  assert.ok(t.isAncestorOf("accounts", "income"));  // direct child
  assert.ok(!t.isAncestorOf("groc", "groc"));  // same account is not
  assert.ok(!t.isAncestorOf("hair", "self"));  // backwards
  assert.ok(t.isAncestorOf("assets", "itcor"))  // multiple levels
  assert.ok(!t.isAncestorOf("none", "bank"))  // nonexistent parent
  assert.ok(!t.isAncestorOf("bank", "none"))  // nonexistent child
});

QUnit.test("Account sign", function(assert) {
  var t = makeTree();
  assert.equal(t.accountSign("bank"), 1);
  assert.equal(t.accountSign("income"), -1);
  assert.equal(t.accountSign("credit"), -1);
  assert.equal(t.accountSign("liabilities"), -1);
  assert.equal(t.accountSign("saved"), -1);
  assert.equal(t.accountSign("equity"), -1);
  assert.equal(t.accountSign("open"), -1);
});

QUnit.test("Add transaction", function(assert) {
  var t = makeTree();
  t.resetBalances();
  
  var transaction = { debit: "itcor", credit: "salary", amount: 231500 };
  t.recordTransaction(transaction);
  assert.equal(t.getBalance("itcor"), 231500);
  assert.equal(t.getBalance("salary"), 231500);

  // check if amount bubbled up to parent accounts
  assert.equal(t.getBalance("bank"), 231500);
  assert.equal(t.getBalance("income"), 231500);
  assert.equal(t.getBalance("accounts"), 0);
});

QUnit.test("Reverse transaction", function(assert) {
  var tr = { timestamp: 1000, description: "pizza", amount: 3200, debit: "expenses", credit: "itau" };
  var reversedTr = reverseTransaction(tr);
  assert.equal(reversedTr.description, "Reverse " + tr.description);

  // modifying reversed does not affect original
  reversedTr.credit = "bank";
  assert.equal(tr.credit, "itau");
});
