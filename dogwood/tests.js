"use strict";

function makeTree() {
  var testTree = new AccountTree("accounts");

  testTree.clear();
  
  testTree.addAccount("assets", "accounts");
  testTree.addAccount("bank", "assets");
  testTree.addAccount("bradesco", "bank");
  testTree.addAccount("itau", "bank");
  testTree.addAccount("caixa", "bank");
  testTree.addAccount("santander", "bank");
  testTree.addAccount("wal", "assets");
  testTree.addAccount("front", "wal");
  testTree.addAccount("back", "wal");

  testTree.addAccount("expenses", "accounts");
  testTree.addAccount("groc", "expenses");
  testTree.addAccount("pao", "groc");
  testTree.addAccount("merc", "groc");
  testTree.addAccount("self", "expenses");
  testTree.addAccount("health", "self");
  testTree.addAccount("body", "health");
  testTree.addAccount("hair", "body");

  testTree.addAccount("hsbc", "bank");

  return testTree;
}
// ["0 accounts",
//   "1 assets",
//    "2 bank",
//     "3 bradesco", "3 itau", "3 caixa", "3 santander", "3 hsbc",
//    "2 wal",
//     "3 front", "3 back",
//   "1 expenses",
//    "2 groc",
//     "3 pao", "3 merc",
//    "2 self", "3 health", "4 body", "5 hair"]

QUnit.test("Get immediate children of accounts", function(assert) {
  var testTree = makeTree();
  console.log(testTree);
  var accountsChildren = testTree.getImmediateChildren("accounts");
  assert.ok(accountsChildren.length === 2);
});

QUnit.test("Get all children of an account", function(assert) {
  var testTree = makeTree();
  var selfChildren = testTree.getChildren("self");
  
  // does not contain banks
  assert.ok(selfChildren.indexOf("bradesco") === -1);

  // immediate child
  assert.ok(selfChildren.indexOf("health") !== -1);
  
  // deeper level
  assert.ok(selfChildren.indexOf("hair") !== -1);
});

QUnit.test("First child of a parent", function(assert) {
  var testTree = makeTree();
  assert.ok(testTree.firstChild("accounts") === "assets");
  assert.ok(testTree.firstChild("bank") === "bradesco");
  assert.ok(testTree.firstChild("body") === "hair");
});

QUnit.test("Last child of a parent", function(assert) {
  var testTree = makeTree();
  assert.ok(testTree.lastChild("body") === "hair");
  assert.ok(testTree.lastChild("bank") === "hsbc");
  assert.ok(testTree.lastChild("accounts") === "expenses");
});
