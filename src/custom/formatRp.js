// const accounting = require('accounting');
function formatRp (n, decimal, d, t) {
  var s, i, j;
  decimal = isNaN(decimal = Math.abs(decimal)) ? 0 : decimal;
  d = d === undefined ? ',' : d; // decimal mark
  t = t === undefined ? '.' : t; // thousand grouping mark
  s = n < 0 ? '-' : '';
  i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(decimal)));
  j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (decimal ? d + Math.abs(n - i).toFixed(decimal).slice(2) : '');
}

module.exports = formatRp;
