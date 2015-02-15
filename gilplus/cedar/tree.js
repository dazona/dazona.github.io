"use strict";

function Node(id, parentId) {
  this.id = id;
  this.children = [];
  this.parentId = parentId;
}

Node.prototype.findNode = function(nodeId) {
  // return a reference to the node matching nodeId
  
  function traverse(currentNode) {
    if (currentNode.id === nodeId) {
      return currentNode;
    } else {
      var result = null;

      // loop while nodeId does not match
      for (var i = 0, len = currentNode.children.length; i < len && result === null; i++) {
        result = traverse(currentNode.children[i]);
      }
      return result;
    }
  }
  return traverse(this);
};

Node.prototype.hasNode = function(nodeId) {
  return Boolean(this.findNode(nodeId));
};

Node.prototype.addNode = function(newId) {
  this.children.push(new Node(newId, this.id));
};

Node.prototype.flatten = function(depthDisplay) {
  // return depths and ids of all nodes as an array

  depthDisplay = depthDisplay || function(depth) { return depth; };

  var nodeList = [];

  function traverse(node, depth) {
    nodeList.push((depthDisplay(depth) + " " + node.id).trim());
    for (var i = 0, len = node.children.length; i < len; i++) {
      traverse(node.children[i], depth + 1);
    }
  }
  traverse(this, 0);
  return nodeList;
};


function AccountTree(rootId) {
  // store root node for convenience
  this.rootAccount = new Node(rootId, null);
}

AccountTree.prototype.findAccount = function(accountId) {
  // return node matching id
  return this.rootAccount.findNode(accountId);
};

AccountTree.prototype.hasAccount = function(accountId) {
  return Boolean(this.findAccount(accountId));
};

AccountTree.prototype.addAccount = function(accountId, parentId) {
  if (this.hasAccount(accountId)) {
    console.log("Cannot add duplicate account: " + accountId);
  } else {
    try {
      var parentAccount = this.findAccount(parentId);
      parentAccount.addNode(accountId);
    } catch(e) {
      // if parentId is not found
      console.log(e);
    }
  }
};

function indexOfChild(arr, id) {
  // used in determining order of accounts

  for (var index = 0, len = arr.length; index < len; index++) {
    if (arr[index].id === id) {
      return index;
    }
  }
  // when used for "adding after an account", a nonexistent id should be
  // passed. -1 is incremented by one, resulting in a splice at index 0
  return -1;
}

AccountTree.prototype.moveAccountToAfter = function(accountId, newParentId, addAfterId) {
  // get references to affected accounts
  var account = this.findAccount(accountId);
  var accountParent = this.findAccount(account.parentId);
  var newParent = this.findAccount(newParentId);

  // prevent moving an account to its own child (this creates an orphan)
  if (account.hasNode(newParentId)) {
    console.log("Cannot move " + account.id + " to its own child, " + newParentId);
  } else {
    account.parentId = newParentId;

    // remove account from parent's list of children
    var accountIndex = indexOfChild(accountParent.children, account.id);
    accountParent.children.splice(accountIndex, 1);

    // index of destination in the parent's list of children
    var destIndex = indexOfChild(newParent.children, addAfterId) + 1;
    newParent.children.splice(destIndex, 0, account);
  }
};

AccountTree.prototype.clear = function() {
  this.rootAccount.children = [];
};

AccountTree.prototype.flatten = function() {
  return this.rootAccount.flatten();
};

AccountTree.prototype.getAccountList = function() {
  return this.rootAccount.flatten(function(depth) {
    var result = "";
    for (var i = 1; i < depth; i++) {
      result += ">";
    }
    return result;
  });
};

AccountTree.prototype.getAccountsExcept = function(accountId) {
  var nodeList = [];

  function traverse(node) {
    nodeList.push(node.id);
    for (var i = 0, len = node.children.length; i < len; i++) {
      if (node.children[i].id !== accountId) {
        traverse(node.children[i])
      }
    }
  }
  traverse(this.rootAccount);
  return nodeList;
};

AccountTree.prototype.getImmediateChildren = function(accountId) {
  accountId = accountId || this.rootAccount.id;
  
  var account = this.findAccount(accountId);
  var childrenList = [];
  
  for (var i = 0, len = account.children.length; i < len; i++) {
    childrenList.push(account.children[i].id);
  }
  return childrenList;
};
