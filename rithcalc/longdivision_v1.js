// numerator / denominator = quotient
function longDivisionIter(n, d, q, bases, decimalPlaces) {
  if (d === 0) {
    return Infinity;
  }

  if (n < d) {
    console.log("numerator less than denominator");
    return q;
  }

  if (bases.length > 99) {
    console.log("iteration limit reached");
  }
  
  var ds = d.toString();  // denominator string
  var ns = n.toString();  // numerator string

  var front = ns.substr(0, ds.length);
  
  if (+ds > +front) {
    front = ns.substr(0, ds.length+1);
  }

  var tens = ns.length - front.length;

  var qq = Math.floor(+front/+ds);

  var qqTens = qq * Math.pow(10, tens);
  
  console.log(front);

  var baseIndex = bases.indexOf(front);

  if (baseIndex > -1) {
    console.log("found repeated calculation at index " + baseIndex);
    return q.toString().replace(/0*$/g, "") + " (repeat from " + baseIndex + ")";
  }
  
  bases.push(front);

  console.log("qq: " + Math.floor(+front/+ds));
  
  return longDivisionIter(n - (d * qqTens),
                          d,
                          q + qqTens,
                          bases);
}

function longDivision(n, d, decimalPlaces) {
  var resultSign = ((n < 0 && d < 0) || (n > 0 && d > 0)) ? "" : "-";
                               
  return resultSign + longDivisionIter(Math.abs(n), Math.abs(d), 0, [], decimalPlaces);
}

function myDivision(n, d) {
  var decimalPlaces = 8;

  var integralQuotient = longDivision(n, d, 0);
  
  var remainder = n - (d * integralQuotient);

  console.log("mydiv remainder: " + remainder);

  var decimalNumerator = remainder * Math.pow(10, decimalPlaces);

  return integralQuotient + "." + longDivision(decimalNumerator, d, decimalPlaces);
}
