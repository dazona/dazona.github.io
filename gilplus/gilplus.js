var gilplus = (function gilplus(accounts,
                                transactions,
                                focusedAccount,
                                focusedDescription,
                                startDate,
                                endDate) {

  focusedAccount = focusedAccount || "accounts";  // top level account
  focusedDescription = focusedDescription.trim() || "";
  startDate = startDate || "1/1/1970";
  endDate = endDate || "1/1/2099";

  // time in milliseconds
  startDateMillis = parseDMY(startDate);
  endDateMillis = parseDMY(endDate);
  
  // a dictionary to retrieve an account's list of children ids and
  // balance by its id
  function initializeAccountInfo() {
    var accountInfo = {};

    // initialize tree root
    accountInfo['accounts'] = { children: [], balanceAll: 0, balanceTimeFrame: 0 };
    
    accounts.forEach(function(account) {
      accountInfo[account.id] = { children: [], balanceAll: 0, balanceTimeFrame: 0, sign: account.sign };
    });
    return accountInfo;
  }

  // set account's children in accountInfo to list of all descendants
  function storeChildrenIds(node, accountInfo) {

    // compile list of children ids (all levels deep, all descendants)
    function getChildrenIds(node) {
      var childrenIds = [node.id];
      
      function traverse(currentNode) {
        currentNode.children.forEach(function(child) {
          childrenIds.push(child.id);
          if (child.children.length > 0) {
            traverse(child);
          }
        });
      }

      traverse(node);
      return childrenIds;
    }

    accountInfo[node.id].children = getChildrenIds(node);
    node.children.forEach(function(child) {
      storeChildrenIds(child, accountInfo);
    });
  }
  
  // helper for building account tree
  function addIfChild(parentNode, trialNode) {

    if (parentNode.id === trialNode.parent) {
      // initialize empty children array
      trialNode.children = [];
      parentNode.children.push(trialNode);
    } else {
      parentNode.children.forEach(function(child) {
        addIfChild(child, trialNode);
      });
    }
  }
  
  // structure used for displaying account relationships
  function buildAccountTree() {
    var accountTree = { id: "accounts", children: [] };

    accounts.forEach(function(account) {
      addIfChild(accountTree, account);
    });

    return accountTree;
  }

  var accountTree = buildAccountTree();
  var accountInfo = initializeAccountInfo();
  storeChildrenIds(accountTree, accountInfo);


  // process transactions
  function filterTransactions() {
    var filteredTransactions = [];

    transactions.forEach(function(transaction) {
      // keep transaction if its debit or credit is a descendant of
      // the focusedAccount, fits the focusedDescription, and is in
      // between the selected dates

      var transactionDateMillis = parseDMY(transaction.date);
      if ((accountInfo[focusedAccount].children.indexOf(transaction.debit) !== -1 ||
           accountInfo[focusedAccount].children.indexOf(transaction.credit) !== -1) &&
          transaction.description.indexOf(focusedDescription) !== -1 &&
          (transactionDateMillis >= startDateMillis &&
           transactionDateMillis <= endDateMillis)) {
        filteredTransactions.push(transaction);
      }
    });
    return filteredTransactions;      
  }
  
  return {
    accountTree: accountTree,
    accountInfo: accountInfo,
    filteredTransactions: filterTransactions(),
  };
  
})(myAccounts, myTransactions, focusedAccount, focusedDescription, startDate, endDate);
