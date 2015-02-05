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
    // call addToTree and save return value, warn if addToTree fails
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
    // search again in each child
    for (var i = 0, len = tree.children.length; i < len; i++) {
      // remember that array.forEach() does not support breaking out of
      // loop
      return addToTree(tree.children[i], item)
    }
  }
}

function findChildren(node) {
  // given a node in the account tree, build a list of all children

  // consider the node itself as a child (for including own
  // transactions)
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
