function toMillis(dateString, hourString) {
  // if omitted, use a default time
  hourString = hourString || "17:00";
  var timeMoment = moment(dateString + " " + hourString, "D/M/YY H:m");
  if (!timeMoment.isValid()) {
    throw new Error("Cannot parse datetime " + dateString + " " + hourString);
  } else {
    return timeMoment.valueOf();
  }
}

function reverseTransaction(transaction) {
  var newTransaction = { timestamp: moment().valueOf(),
                         description: "[Reverse " + transaction.description + "]",
                         amount: -transaction.amount,
                         debit: transaction.debit,
                         credit: transaction.credit,
                         reversed: true,
                       };
  transaction.reversed = true;
  return newTransaction;
}
