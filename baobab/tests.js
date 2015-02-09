var tree = new Tree("accounts");

tree.addAccount("assets");
tree.addAccount("bank", "assets");
tree.addAccount("bradesco", "bank");
tree.addAccount("expenses");
tree.addAccount("itau", "bank");
tree.addAccount("wallet", "assets");

QUnit.test("Hello Test", function(assert) {
  assert.ok(1 == '1', 'passed');
  assert.ok(2 == '2', 'passed');
  assert.equal(1, "1", "type conversion");
  assert.ok(tree.hasAccount("accounts"), "tree has root id");
  assert.ok(tree.hasAccount("bank"), "tree has bank id");

});

