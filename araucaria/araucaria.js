DEBUG = true;

function build(accountList, transactionList, filter) {
  "use strict";

  // Do not modify inputs (accountList, transactionList)

  // Build an account tree (a nested collection of nodes, where each node
  // has a 'children' property
  
  // set up account tree root
  var accountTree = { id: "accounts", name: "Accounts", children: [] };

  // Build a dictionary mapping account ids to a list of children, total
  // balance, and balance of filtered accounts
  
  // set up account dictionary (easier access than traversing the tree)
  var accountInfo = {};

  // set up empty list to hold transactions matching the filter
  var filteredTransactions = [];

  // default filter will show all transactions
  filter = filter || {};
  
  var focusedAccount = filter.focusedAccount || "accounts";
  var focusedDescription = filter.focusedDescription || "";
  var startDate = filter.startDate || "1/1/1970";
  var endDate = filter.endDate || "1/1/2099";


  // BEGIN ACTIONS
  // populate tree
  accountList.forEach(function(account) {
    // call addToTree and save its return value, warn if addToTree fails
    if (!addToTree(accountTree, account)) {
      add_warning("Populating account tree, addToTree: " + account.id + " has no matching parent");
    }
  });

  // populate accountInfo
  function findTreeNodeChildren(node) {
    // populate node's children
    accountInfo[node.id] = { children: [], balanceTotal: 0, balanceFiltered: 0 };
    accountInfo[node.id].children = findChildren(node);

    // traverse children
    node.children.forEach(function(child) {
      findTreeNodeChildren(child);
    });
  }

  findTreeNodeChildren(accountTree);

  // create sorted list of accounts
  var sortedAccountList = treeToSortedList(accountTree);

  // filter transactions
  // TODO
  

  // add each filtered transaction to account balances
  // TODO
  
  
  return { accountTree: accountTree,
           accountInfo: accountInfo,
           filteredTransactions: filteredTransactions,
         };
}

function addToTree(tree, item) {
  // try adding item to the right place in the tree

  if (item.parent === tree.id) {
    // initialize new object representing the item
    tree.children.push({ id: item.id, children: [], });
    return true;
  } else if (tree.children.length > 0) {
    // search again in each child:
    // for loop is used because array.forEach() does not allow breaking
    // out of the loop
    for (var i = 0, len = tree.children.length; i < len; i++) {
      // create a new scope for the array index in each depth level
      // anonymous function returns result of attempt to add in child
      var addedToChildren = (function (i) {
        return addToTree(tree.children[i], item);
      })(i);
      if (addedToChildren === true) {
        return true;
      }
    }
  }
}

function addToTreeNoClosure(tree, item) {
  if (item.parent === tree.id) {
    tree.children.push({ id: item.id, children: [], });
  } else {
    for (var i = 0, len = tree.children.length; i < len; i++) {
      addToTreeNoClosure(tree.children[i], item);
    }
  }
}

function findChildren(node) {
  // given a node in the account tree, build a list of all its children

  // consider the node itself as a child (for transactions that belong
  // directly to that account)
  var childList = [node.id];
  
  function traverse(currentNode) {
    currentNode.children.forEach(function(child) {
      childList.push(child.id);
      traverse(child);
    });
  }
  traverse(node);
  
  return childList;
}

function treeToSortedList(tree) {
  // build a list of accounts sorted by depth, used when rearranging the
  // order of accounts

  var sortedList = [];

  function traverse(node) {
    // first, add tree root's immediate children to the sorted list
    node.children.forEach(function(child) {
      sortedList.push(child.id);
    });

    // then go to each child
    node.children.forEach(function(child) {
      traverse(child);
    });
  }
  traverse(tree);
  return sortedList;
}

function moveBranch(tree, branch, newParent) {
  // move the tree's branch as a child of the given parent

  // check that the newParent is not a child of the branch
  if (isChild(newParent, branch)) {
    add_warning("Cannot move " + branch.id + " to its own child.");
    console.log("Cannot move " + branch.id + " to its own child.");
    return false;
  }

}

function getBranch(tree, id) {
  // get subtree matching the id
  if (tree.id === id) {
    return tree;
  } else {
    var result = null;
    for (var i = 0, len = tree.children.length; i < len && result === null; i++) {
      result = getBranch(tree.children[i], id);
    }
    return result;
  }
  return null;
}

function accountExists(tree, id) {
  // check if given id is in the tree

  if (tree.id === id) {
    return true;
  } else {
    for (var i = 0, len = tree.children.length; i < len; i++) {
      // create a new scope for each child
      // anonymous function returns the result of search in child 
      var existsInChild = (function(i) {
        return accountExists(tree.children[i], id);
      })(i);
      if (existsInChild === true) {
        return true;
      }
    }
  }
}

function accountExistsIter(tree, id) {
  if (tree.id === id) {
    return true;
  } else {
    var result = false;
    // must stop when result is true
    for (var i = 0; i < tree.children.length && result === false; i++) {
      result = accountExistsIter(tree.children[i], id);
    }
    return result;
  }
  return false;
}

function isChild(child, parent) {
  return getBranch(parent, child);
}

function isParent(parent, child) {
  return getBranch(parent, child);
}
