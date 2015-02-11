"use strict";

function AccountTree(rootId) {
  this.rootId = rootId;
  this.accounts = {};
  this.clear();
}

AccountTree.prototype.clear = function() {
  // remove all accounts
  this.accounts[this.rootId] = { parentId: null, previousSiblingId: "" };
}

AccountTree.prototype.findAccount = function(accountId) {
  return this.accounts[accountId];
}

AccountTree.prototype.hasAccount = function(accountId) {
  return Boolean(this.findAccount(accountId));
}

AccountTree.prototype.addAccount = function(accountId, parentId, previousSiblingId) {
  previousSiblingId = previousSiblingId || "";
  
  if (this.hasAccount(accountId)) {
    console.log("Cannot add duplicate account: " + accountId);
  } else if (previousSiblingId !== "" && !this.hasAccount(previousSiblingId)) {
    console.log("Previous sibling " + previousSiblingId + " not found");
  } else {

    // if previousSiblingId === "" and children.length > 1 
    // make previousSiblingId the last item
    if (previousSiblingId === "" && this.getImmediateChildren(parentId).length > 0) {
      previousSiblingId = this.lastChild(parentId);
    }
    this.accounts[accountId] = { parentId: parentId, previousSiblingId: previousSiblingId };
  }
}

AccountTree.prototype.getImmediateChildren = function(accountId) {
  accountId = accountId || this.rootId;
  var childrenList = [];

  for (var id in this.accounts) {
    if (this.accounts.hasOwnProperty(id) && this.accounts[id].parentId === accountId) {
      childrenList.push(id);
    }
  }
  return childrenList;
}

AccountTree.prototype.getChildren = function(accountId) {
  accountId = accountId || this.rootId;

  var childrenList = [];
  var tree = this;
  
  function traverse(currentNodeId) {
    var immediateChildren = tree.getImmediateChildren(currentNodeId);
    for (var i = 0, len = immediateChildren.length; i < len; i++) {
      var childId = immediateChildren[i];
      childrenList.push(childId);
      traverse(childId);
    }
  }
  traverse(accountId);
  return childrenList;
}

// TODO build nested object
AccountTree.prototype.buildTree = function() {
  return;
}

AccountTree.prototype.firstChild = function(parentId) {
  if (!this.hasAccount(parentId)) {
    console.log("Warning: cannot find first child, " + parentId + " not found.");
  }
  var children = this.getImmediateChildren(parentId);
  for (var i = 0, len = children.length; i < len; i++) {
    // account without a previousSiblingId is first
    if (this.accounts[children[i]].previousSiblingId === "") {
      return children[i];
    }
  }
  console.log("Warning: first child of " + parentId + " not found.");
  return "";
}

AccountTree.prototype.lastChild = function(parentId) {
  var children = this.getImmediateChildren(parentId);
  
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
  console.log("Warning: last child of " + parentId + " not found.");
  return "";
}

// TODO
// Move an account to a point after designated target

