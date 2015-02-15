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
