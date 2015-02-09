var myAccounts = [
  {
    name: "Assets",
    id: "assets",
    parent: "accounts",
    sign: 1,
  },

  {
    name: "Bank",
    id: "bank",
    parent: "assets",
    sign: 1,
  },

  {
    name: "Wallet",
    id: "wallet",
    parent: "assets",
    sign: 1,
  },


  {
    name: "WalB",
    id: "walb",
    parent: "wallet",
    sign: 1,
  },
  
  {
    name: "WalC",
    id: "walc",
    parent: "walb",
    sign: 1,
  },
  
  {
    name: "WalD",
    id: "wald",
    parent: "walc",
    sign: 1,
  },
  
  
  {
    name: "Income",
    id: "income",
    parent: "accounts",
    sign: -1,
  },

  {
    name: "Bradesco",
    id: "bradesco",
    parent: "bank",
    sign: 1,
  },

  {
    name: "Expenses",
    id: "expenses",
    parent: "accounts",
    sign: 1,
  },

  {
    name: "Drawer",
    id: "drw",
    parent: "assets",
    sign: 1,
  },
  
  {
    name: "Groceries",
    id: "groc",
    parent: "expenses",
    sign: 1,
  },

  {
    name: "Pao de Acucar",
    id: "pao",
    parent: "groc",
    sign: 1,
  },
  
  {
    name: "Envelope",
    id: "env",
    parent: "assets",
    sign: 1,
  },
  
];

// test tree functions

var tree = {
  "id": "accounts",
  "name": "Accounts",
  "children": [
    {
      "id": "assets",
      "children": [
        {
          "id": "bank",
          "children": [
            {
              "id": "bradesco",
              "children": []
            }
          ]
        },
        {
          "id": "wallet",
          "children": [
            {
              "id": "walb",
              "children": [
                {
                  "id": "walc",
                  "children": [
                    {
                      "id": "wald",
                      "children": []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "drw",
          "children": []
        },
        {
          "id": "env",
          "children": []
        }
      ]
    },
    {
      "id": "income",
      "children": []
    },
    {
      "id": "expenses",
      "children": [
        {
          "id": "groc",
          "children": [
            {
              "id": "pao",
              "children": []
            }
          ]
        }
      ]
    }
  ]
};

moveBranch(tree, {
          "id": "bank",
          "children": [
            {
              "id": "bradesco",
              "children": []
            }
          ]
        },
"wal");

if(!accountExists(tree, 'groc')) {
  add_warning("groc not found with accountExists");
}

console.log(getBranch(tree, 'walb'));

console.log(isParent(getBranch(tree, 'bank'), 'bradesco'));

console.log(isChild('bradesco', getBranch(tree, 'bank')));

moveBranch(tree, getBranch(tree, 'bank'), 'expenses');

console.log(accountExistsIter(tree, "walb"));
console.log(accountExists(tree, "walb"));

var myTree = { id: "accounts", name: "Accounts", children: [] };

myAccounts.forEach(function(account) {
  addToTreeNoClosure(myTree, account);
});

outobj(myTree);
