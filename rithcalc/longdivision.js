// numerator / denominator = quotient
function longDivisionIter(n, d, q, bases, steps) {
  if (d === 0) {
    return Infinity;
  }

  if (n < d) {
    console.log("remainder " + n);
    return q;
  }

  if (bases.length > 20) {
    console.log("iteration limit reached");
    return 0;
  }

  if (n === 0) {
    console.log("numerator reached zero");
    return q;
  }
  
  var ds = d.toString();  // denominator string
  var ns = n.toString();  // numerator string

  var front = ns.substr(0, ds.length);
  
  if (+ds > +front) {  // front numbers do not fit denominator
    front = ns.substr(0, ds.length+1);  
  }

  var tens = ns.length - front.length;  // relative size of front numbers

  var qq = Math.floor(+front/+ds);  // whole amounts of denominator

  var qqTens = qq * Math.pow(10, tens);  // partial quotient
  
  console.log(front);

  var baseIndex = bases.indexOf(front.replace(/0*$/g, ""));

  if (baseIndex > -1) {
    console.log("found repeated calculation at index " + baseIndex);
    return q.toString().replace(/0*$/g, "") + " (repeat from " + baseIndex + ")";
  }

  bases.push(ns.replace(/0*$/g, ""));

  console.log("qq: " + Math.floor(+front/+ds));
  
  return longDivisionIter(n - (d * qqTens),
                          d,
                          q + qqTens,
                          bases);
}

function longDivision(n, d, decimalPlaces) {
  return longDivisionIter(Math.abs(n), Math.abs(d), 0, [], []);
}
