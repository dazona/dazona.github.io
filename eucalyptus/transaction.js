function toMillis(dateString, hourString) {
  // if omitted, use a default time
  hourString = hourString || "17:00";
  return moment(dateString + " " + hourString, "D/M/YY H:m").valueOf();
}

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
