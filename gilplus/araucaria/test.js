// ensure there are no duplicate ids
var account_ids = [];

var warnings = "";

function add_warning(warning) {
  warnings += "<b>Note:</b> " + warning + "<br>";
}

myAccounts.forEach(function(account) {
  if (account_ids.indexOf(account.id) !== -1) {
    add_warning("ERROR: duplicate id found: " + account.id);
  }
  account_ids.push(account.id);
});

// ensure account exists
function account_exists(id) {
  var exists = false;
  accounts.forEach(function(account) {
    if (account.id === id) {
      exists = true;
    }
  });
  return exists;
}


// ensure debit and credit accounts exist
myTransactions.forEach(function(transaction) {
  if (account_ids.indexOf(transaction.debit) === -1 ||
      account_ids.indexOf(transaction.credit) === -1) {
    add_warning("Transaction " + transaction.desc + " references nonexistent account(s): " + transaction.debit + "/" + transaction.credit);
  }
});


// test amount parsing

function test_amount_parsing(amount_str, amount_cents) {
  if (parseAmount(amount_str) !== amount_cents) {
    add_warning("Amount parsed incorrectly: " + amount_str);
  }
}

// comma or period
test_amount_parsing("1.00", 100);
test_amount_parsing("1,00", 100);

// no separator
test_amount_parsing("3", 300);
test_amount_parsing("30", 3000);

// odd number after separator
test_amount_parsing("1.129", 112);
test_amount_parsing("1.1", 110);

// starts with separator
test_amount_parsing(",02", 2);


// test balance formatting

function test_balance_formatting(amount, amount_str) {
  if (display_balance(amount) !== amount_str) {
    add_warning("Amount displayed incorrectly: " + amount);
  }
}

// varying sizes of cents
test_balance_formatting(0, "0.00");
test_balance_formatting(1, "0.01");
test_balance_formatting(10, "0.10");
test_balance_formatting(100, "1.00");
test_balance_formatting(1000, "10.00");
test_balance_formatting(12345, "123.45");

// negative amounts
test_balance_formatting(-1, "-0.01");
test_balance_formatting(-10, "-0.10");
test_balance_formatting(-100, "-1.00");
test_balance_formatting(-1000, "-10.00");
test_balance_formatting(-12345, "-123.45");

// console.log(warnings);


