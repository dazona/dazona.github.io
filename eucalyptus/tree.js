"use strict";

function AccountTree(rootId) {
  this.rootId = rootId;

  // http://eloquentjavascript.net/06_object.html
  // Object.create(null) makes the use of hasOwnProperty unnecessary
  this.accounts = Object.create(null);
  this.clearAccounts();
}

AccountTree.prototype.clearAccounts = function() {
  // remove all accounts
  this.accounts[this.rootId] = { parentId: null, previousSiblingId: "", name: "" };
}

AccountTree.prototype.accountSign = function(accountId) {
  // hardcode negative root accounts rather than specifying 
  var negativeAccounts = ["liabilities", "equity", "income"];

  // if accountId matches a root account, return -1
  if (negativeAccounts.indexOf(accountId) !== -1) {
    return -1;
  }
  
  for (var i = 0, len = negativeAccounts.length; i < len; i++) {
    if (this.isAncestorOf(negativeAccounts[i], accountId)) {
      return -1;
    }
  }
  return 1;
}

AccountTree.prototype.getAccount = function(accountId) {
  if (accountId in this.accounts) {
    return this.accounts[accountId];
  } else {
    return null;
  }
}

AccountTree.prototype.addAccount = function(accountId, name, parentId, previousSiblingId) {
  previousSiblingId = previousSiblingId || "";
  
  if (this.getAccount(accountId)) {
    throw new Error("Cannot add duplicate account id: " + accountId);
  } else if (previousSiblingId !== "" && !this.getAccount(previousSiblingId)) {
    throw new Error("Previous sibling " + previousSiblingId + " not found");
  } else {

    // if previousSiblingId === "" and children.length > 1 
    // make previousSiblingId the last item
    if (previousSiblingId === "" && this.immediateChildren(parentId).length > 0) {
      previousSiblingId = this.lastChild(parentId);
    }
    this.accounts[accountId] = { name: name, parentId: parentId, previousSiblingId: previousSiblingId, balance: 0 };
  }
}

AccountTree.prototype.immediateChildren = function(accountId) {
  accountId = accountId || this.rootId;
  var childrenList = [];

  // for-in (for in) loop to find accounts matching parentId 
  for (var id in this.accounts) {
    if (this.accounts[id].parentId === accountId) {
      childrenList.push(id);
    }
  }
  return childrenList;
}

AccountTree.prototype.children = function(accountId) {
  accountId = accountId || this.rootId;

  var childrenList = [];
  var tree = this;
  
  function traverse(currentNodeId) {
    var immediateChildren = tree.immediateChildren(currentNodeId);
    for (var i = 0, len = immediateChildren.length; i < len; i++) {
      var childId = immediateChildren[i];
      childrenList.push(childId);
      traverse(childId);
    }
  }
  traverse(accountId);
  return childrenList;
}

// build nested object with given id as the root
AccountTree.prototype.buildTree = function(rootId) {
  rootId = rootId || this.rootId;
  
  if (!this.getAccount(rootId)) {
    throw new Error("buildTree cannot find account " + rootId);
  }
  var result = { id: rootId, children: [] };
  var tree = this;

  // var count = 0;
  function traverse(currentNode) {
    // use order given by previousSiblingIds
    var lastChild = tree.lastChild(currentNode.id);

    if (lastChild) {
      // initialize with lastChild
      var orderedImmediateChildren = [lastChild];

      // keep looking back until "" is found
      while(tree.getAccount(lastChild).previousSiblingId !== "") {
        lastChild = tree.getAccount(lastChild).previousSiblingId;
        orderedImmediateChildren.push(lastChild);
      } 

      // get immediate children, add to own children and recurse
      for (var i = orderedImmediateChildren.length - 1; i >= 0; i--) {
        var newNode = { id: orderedImmediateChildren[i], children: [] };
        currentNode.children.push(newNode);
        traverse(newNode);
      }
    }
  }
  traverse(result);
  
  return result;
};

AccountTree.prototype.flatten = function(tree, depthDisplay) {
  tree = tree || this.buildTree();
  // prefixed value used in display
  depthDisplay = depthDisplay || function(depth) { return depth; };
  
  var nodeList = [];
  
  function traverse(node, depth) {
    nodeList.push((depthDisplay(depth) + " " + node.id).trim());
    for (var i = 0, len = node.children.length; i < len; i++) {
      traverse(node.children[i], depth + 1);
    }
  }
  traverse(tree, 0);
  return nodeList;
}

AccountTree.prototype.firstChild = function(parentId) {
  if (!this.getAccount(parentId)) {
    throw new Error("Cannot find first child, " + parentId + " not found.");
  }
  var children = this.immediateChildren(parentId);
  for (var i = 0, len = children.length; i < len; i++) {
    // account without a previousSiblingId is first
    if (this.accounts[children[i]].previousSiblingId === "") {
      return children[i];
    }
  }
  return null;
}

AccountTree.prototype.lastChild = function(parentId) {
  var children = this.immediateChildren(parentId);
  
  // an only child is also the last child
  if (children.length === 1) {
    return children[0];
  }

  // collect list of previousSiblings
  var previousSiblings = [];
  for (var i = 0, len = children.length; i < len; i++) {
    var previousSibling = this.accounts[children[i]].previousSiblingId;
    if (previousSibling !== "") {
      previousSiblings.push(previousSibling);
    }
  }
  
  // id that does not appear in list of previousSiblingIds is last
  for (var i = 0, len = children.length; i < len; i++) {
    if (previousSiblings.indexOf(children[i]) === -1) {
      return children[i];
    }
  }
  return null;
}

AccountTree.prototype.nextSibling = function(accountId) {
  // find the account whose previousSiblingId is the given accountId
  var account = this.getAccount(accountId);
  var nextAccount = null;
  
  if (!account) {
    return null;
  }
  
  var siblings = this.immediateChildren(account.parentId);
  for (var i = 0, len = siblings.length; i < len; i++) {
    if (this.getAccount(siblings[i]).previousSiblingId === accountId) {
      nextAccount = siblings[i];
    }
  }
  return nextAccount;
}

AccountTree.prototype.moveTo = function(accountId, newParentId, newPreviousSiblingId) {
  var account = this.getAccount(accountId);
  var newParentAccount = this.getAccount(newParentId);
  var newPreviousSibling = null;

  if (newPreviousSiblingId !== "") {
    newPreviousSibling = this.getAccount(newPreviousSiblingId);
  }

  // stop if one of the given accounts do not exist
  if (!account || !newParentAccount || (newPreviousSibling !== null && !newPreviousSibling)) {
    throw new Error("Cannot move, account, parent, or previous sibling do not exist.");
    return false;
  }
  
  // disallow move to own child
  var accountChildren = this.children(accountId);
  if (accountChildren.indexOf(newParentId) !== -1) {
    throw new Error("Cannot move " + account.name + " to its own child, " + this.getAccount(newParentId).name);
    return false;
  }
  
  // check that newPreviousSiblingId has newParentId as parent
  var parentChildren = this.children(newParentId);

  if (parentChildren.indexOf(newPreviousSiblingId) === -1 && newPreviousSibling !== null) {
    throw new Error("Cannot move " + account.name + ", new sibling " + this.getAccount(newPreviousSiblingId).name + " would not be a sibling.");
    return false;
  }

  var nextSibling = this.firstChild(account.parentId);
  
  var nextSiblingId = this.nextSibling(accountId);
  if (nextSiblingId) {
    var nextSibling = this.getAccount(nextSiblingId);
    // moving account will leave a gap, alter the previousSiblingId of
    // the next account
    nextSibling.previousSiblingId = account.previousSiblingId;
  }

  // if there is an account that will follow the moved account in the
  // destination, alter its previousSiblingId
  var newNextSibling = this.getAccount(this.firstChild(newParentId));

  if (newPreviousSiblingId) {
    newNextSibling = this.getAccount(this.nextSibling(newPreviousSiblingId));
  }

  if (newNextSibling) {
    newNextSibling.previousSiblingId = accountId;
  }
  
  // finally, alter moved account
  account.parentId = newParentId;
  account.previousSiblingId = newPreviousSiblingId;
};

AccountTree.prototype.isChildOf = function(accountId, parentId) {
  var children = this.children(parentId);
  return children.indexOf(accountId) > -1;
};

AccountTree.prototype.belongsTo = function(accountId, parentId) {
  // account isChildOf parent or equals itself
  return accountId === parentId || this.isChildOf(accountId, parentId);
}

// TODO delete account
// Balances of ancestors must change
// Safer to allow deletion only when balance is zero
// Force transfer of balance to new account
AccountTree.prototype.deleteAccount = function(accountId) {
  return;
}

AccountTree.prototype.isAncestorOf = function(parentId, accountId) {
  var account = this.getAccount(accountId);
  var parentAccount = this.getAccount(accountId);

  // ignore nonexistent accounts
  if (!account || !parentAccount) {
    return false;
  }
  
  while (account.parentId) {
    if (parentId === account.parentId) {
      return true;
    }
    account = this.getAccount(account.parentId);
  }
  return false;
}

// save balances in cents
AccountTree.prototype.resetBalances = function() {
  for (var id in this.accounts) {
    this.accounts[id].balance = 0;
  }
};

AccountTree.prototype.getBalance = function(accountId) {
  var account = this.getAccount(accountId);
  
  if (account) {
    return account.balance;
  } else {
    throw new Error("getBalance cannot find account " + accountId);
  }
}

AccountTree.prototype.recordTransaction = function(transaction) {
  var debitAccountId = transaction.debit;
  var creditAccountId = transaction.credit;

  var tree = this;
  
  function traverse(currentAccountId, amount) {
    var currentAccount = tree.getAccount(currentAccountId);
    currentAccount.balance += tree.accountSign(currentAccountId) * amount;
    if (currentAccount.parentId) {
      traverse(currentAccount.parentId, amount);
    }
  }
  
  traverse(debitAccountId, transaction.amount);

  // use negative of the amount
  traverse(creditAccountId, -transaction.amount);
};

AccountTree.prototype.ulTree = function() {
  var bt = this.buildTree();
  var node = bt;

  console.log(bt.children);
  
  var html_tree = "";
  var tree = this;

  function traverse(nextNode) {
    html_tree += "<ul>\n";
    nextNode.children.forEach(function(child) { 
      var account = tree.getAccount(child.id);
      var contents = account.name + " " + account.balance;
      html_tree += "<li>" + contents;
      traverse(child);
      "</li>\n";
    });
    html_tree += "</ul>";                       
  }

  traverse(node);
  return html_tree;
};
