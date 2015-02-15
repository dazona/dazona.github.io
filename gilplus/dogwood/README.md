# Dogwood

# TODO

In UI, when moving an account, use two dropdowns, one for parent and one
for sibling. Selecting parent auto-fills sibling list

Transaction must include hour and date; use UTC because it does not have
daylight savings. Then convert back to local time when displaying.

Save balances in account tree, to avoid having to download the entire
transaction history to compute balances. Filtering transactions by date
computes balance for focused account, not the whole tree, because this
can cause confusion.

Initial page load only downloads the last 30 transactions

Delete account and Move account must update balances for all ancestors
and alter the corresponding transactions

Altering transaction debits and credits must alter corresponding balances
and ancestor balances

Save balances in cents (integers) and convert with the parser.

Transactions have "display" and "reversion" properties that are used when
reverting transactions: instead of deleting a transaction, a new and
opposite transaction is created. The original's "display" becomes false,
and the reversion transaction has "display" = false and "reversion" = true

