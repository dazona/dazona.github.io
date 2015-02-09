"use strict";

function Node(id) {
  this.id = id;
  this.children = [];
}

function Tree(rootId) {
  this.rootId = rootId;
  this.root = new Node(rootId);
}

// http://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
Tree.prototype.findAccount = function(accountId) {
  // return a reference to the branch matching the given id
  function traverse(currentNode) {
    if (currentNode.id === accountId) {
      return currentNode;
    } else {
      var result = null;
      for (var i = 0, len = currentNode.children.length; i < len && result === null; i++) {
        result = traverse(currentNode.children[i])
      }
      return result;
    }
  }
  return traverse(this.root);
};

Tree.prototype.hasAccount = function(accountId) {
  return Boolean(this.findAccount(accountId));
};

Tree.prototype.addAccount = function(id, parentId) {
  // if the parentId is omitted, account is top-level
  parentId = parentId || this.rootId;

  if (this.hasAccount(parentId)) {
    var parentBranch = this.findAccount(parentId);
    parentBranch.children.push(new Node(id));
  } else {
    warn("Cannot add " + id + ", " + parentId + " does not exist");
  }
};

Tree.prototype.display = function() {
  console.log(JSON.stringify(this.root, null, 2));
}
