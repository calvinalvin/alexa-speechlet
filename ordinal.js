const _ithMap = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eigth',
  9: 'ninth',
  10: 'tenth',
  11: 'eleventh',
  12: 'twelfth',
  13: 'thirteenth',
  14: 'fourteenth',
  15: 'fifteenth',
  16: 'sixteenth',
  17: 'seventeenth',
  18: 'eighteenth',
  19: 'nineteenth',
  20: 'twentieth',
  30: 'thirtieth',
  40: 'fourtieth',
  50: 'fiftieth',
  60: 'sixtieth',
  70: 'seventieth',
  80: 'eightieth',
  90: 'ninetieth'
};

module.exports = {
  translate(num) {
    if (typeof num !== 'number') {
      throw new Error('ordinal.translate [argument num is not a number]');
    }

    const intNum = parseInt(num);
    if (intNum <= 0) {
      return 'Negative numbers are not supported';
    }
    else if (intNum > 20) {
      return 'Numbers greater than 20 are not yet supported';
    }

    return _ithMap[intNum];
  }
};
