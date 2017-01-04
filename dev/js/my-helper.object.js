function MyHelper() { }

MyHelper.prototype.toInteger = function(d) {
  d.data[1] = +d.data[1];
  return d;
}

MyHelper.prototype.extractQuarter = function(d) {
  var year = d.substring(0, 4);
  var month = d.substring(5, 7);
  var quarter = year + '/';
  switch (month) {
    case '01':
      quarter += 'I';
      break;
    case '04':
      quarter += 'II';
      break;
    case '07':
      quarter += 'III';
      break;
    case '10':
      quarter += 'IV';
  }
  return quarter;
}