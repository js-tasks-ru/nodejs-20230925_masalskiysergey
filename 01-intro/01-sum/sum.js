function sum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number' || Number.isNaN(a) || Number.isNaN(b)) throw new TypeError('Invalid Value');
    return a + b;
}

module.exports = sum;
