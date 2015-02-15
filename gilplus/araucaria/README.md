# Araucaria

# TODOS

Focus on commenting

init.js calls build, creating an object, displayData, that holds the
accountTree and accountInfo, counting all transactions. Creates an
object, unfilteredData

## Reordering accounts

to redefine parent is one function

to assign order, have a dropdown saying "place after: " and the options are
all accounts at that tree level and "(first account)"

a new function must first rearrange accountList by tree depth (create new array
where each index is the level of the tree, and value is an array of accounts
at that level, then call build to create tree and accountInfo from accountOrder