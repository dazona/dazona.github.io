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

console.log(makeTree().flatten());
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

QUnit.test("Moving nested account to top level", function(assert) {
  var testTree = makeTree();
  testTree.moveAccountToAfter("self", "accounts");
  assert.ok(testTree.rootAccount.flatten()[1] === "1 self");
});

QUnit.test("Reordering account at the same level", function(assert) {
  var testTree = makeTree();
  var flatTree;
  
  testTree.moveAccountToAfter("santander", "bank", "");  // first of list
  flatTree = testTree.flatten();
  assert.ok(flatTree.indexOf("3 santander") < flatTree.indexOf("3 bradesco"));

  // move after bradesco
  testTree.moveAccountToAfter("santander", "bank", "bradesco");
  flatTree = testTree.flatten();
  assert.ok(flatTree.indexOf("3 santander") > flatTree.indexOf("3 bradesco"));

  // move to end of list
  testTree.moveAccountToAfter("santander", "bank", "hsbc");
  flatTree = testTree.flatten();
  assert.ok(flatTree.indexOf("3 bradesco") === flatTree.indexOf("2 bank") + 1);  // ensure bradesco is first of bank
  assert.ok(flatTree.indexOf("3 santander") - flatTree.indexOf("3 bradesco") === 4);
});

QUnit.test("Moving account to shallower level", function(assert) {
  var testTree = makeTree();
  var flatTree;
  
  testTree.moveAccountToAfter("santander", "accounts", "expenses");  // first of list
  flatTree = testTree.flatten();
  assert.ok(flatTree[flatTree.length - 1] === ("1 santander"));
});

QUnit.test("Moving account to deeper level", function(assert) {
  var testTree = makeTree();
  var flatTree;

  testTree.moveAccountToAfter("hair", "bank", "caixa");
  flatTree = testTree.flatten();
  assert.ok(flatTree.indexOf("3 hair") === flatTree.indexOf("3 caixa") + 1);
});
