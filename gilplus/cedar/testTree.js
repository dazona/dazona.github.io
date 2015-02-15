var testTree = new AccountTree("accounts");

testTree.addAccount("assets", "accounts");
testTree.addAccount("bank", "assets");
testTree.addAccount("bradesco", "bank");
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

