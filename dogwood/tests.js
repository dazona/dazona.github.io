"use strict";

function makeTree() {
  var t = new AccountTree("accounts");

  t.clear();
  
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

QUnit.test("Get immediate children of accounts", function(assert) {
  var t = makeTree();
  var accountsChildren = t.immediateChildren("accounts");
  assert.ok(accountsChildren.length === 3);
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
  assert.ok(t.firstChild("accounts") === "assets");
  assert.ok(t.firstChild("bank") === "bradesco");
  assert.ok(t.firstChild("body") === "hair");
});

QUnit.test("Last child of a parent", function(assert) {
  var t = makeTree();
  assert.ok(t.lastChild("body") === "hair");
  assert.ok(t.lastChild("bank") === "hsbc");
  assert.ok(t.lastChild("accounts") === "income");
});

QUnit.test("Find next account", function(assert) {
  var t = makeTree();
  assert.ok(t.nextSibling("bradesco") === "itau");
  assert.ok(t.nextSibling("hsbc") === null);
  assert.ok(t.nextSibling("assets") === "expenses");
});

QUnit.test("Move account at same level", function(assert) {
  var t = makeTree();

  // move to front of level
  t.moveTo("caixa", "bank", "");  
  assert.ok(t.firstChild("bank") === "caixa");  

  // move to same location
  var flatBefore = t.flatten();
  t.moveTo("stm", "groc", "merc");
  var flatAfter = t.flatten();
  assert.ok(JSON.stringify(flatBefore) === JSON.stringify(flatAfter));

  // move to end of list
  t.moveTo("merc", "groc", "dia");
  assert.ok(t.lastChild("groc") === "merc");
});

QUnit.test("Move account to topmost level", function(assert) {
  var t = makeTree();

  // move to first item at topmost level
  t.moveTo("back", t.rootId, "");
  var toplevelAccounts = t.immediateChildren(t.rootId);
  assert.ok(toplevelAccounts.indexOf("back") !== -1);
  assert.ok(t.firstChild(t.rootId) === "back");
  
  // move to last item at topmost level
  t.moveTo("bradesco", t.rootId, t.lastChild(t.rootId));
  assert.ok(t.lastChild(t.rootId) === 'bradesco');
  
  // move to middle of topmost level
  t.moveTo("income", t.rootId, "assets");
  var f = t.flatten();

  assert.ok(f.indexOf("1 income") > f.indexOf("1 assets"));
});

QUnit.test("Move to different branch", function(assert) {
  var t = makeTree();

  // move to first item of different branch
  t.moveTo("merc", "bank", "");
  assert.ok(t.firstChild("bank") === 'merc');

  // move to last item of different branch
  t.moveTo("dia", "bank", "hsbc");
  assert.ok(t.lastChild("bank") === "dia");
  
  // move to middle of different branch
  t.moveTo("pao", "bank", "caixa");
  var f = t.flatten();
  assert.ok(f.indexOf("3 pao") > f.indexOf("3 caixa"));
  
  // move to new singleton leaf
  t.moveTo("stm", "hair", "");
  assert.ok(t.firstChild("hair") === "stm");
  assert.ok(t.lastChild("hair") === "stm");

  // remove leaf and add as new leaf
  t.moveTo("brcor", "stm", "");
  assert.ok(t.firstChild("stm") === 'brcor');

  // remove leaf and move to middle of new branch
  t.moveTo("itcor", "groc", "extra");
  var c = t.children("groc");
  assert.ok(c.indexOf("itcor") > -1);

  var f = t.flatten();
  console.log(f);

});

QUnit.test("Display flat list", function(assert) {
  var t = makeTree();
  var bt = t.buildTree();
  var f = t.flatten(bt);
  assert.ok(true);
});

QUnit.test("Display as tree", function(assert) {
  var t = makeTree();
  t.moveTo("bradesco", "bank", "hsbc");
  var bt = t.buildTree();
  assert.ok(true);
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
