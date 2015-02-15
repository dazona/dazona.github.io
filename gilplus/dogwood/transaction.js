function reverseTransaction(transaction) {
  var newTransaction = { timestamp: transaction.timestamp,
                         description: "Reverse " + transaction.description,
                         amount: -transaction.amount,
                         debit: transaction.debit,
                         credit: transaction.credit,
                         reversed: true,
                       };
  transaction.reversed = true;
  return newTransaction;
}
