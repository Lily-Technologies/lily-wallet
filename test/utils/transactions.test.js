const assert = require('assert');
const {
	original,
	addresses } = require('../fixtures/serializeTransactions.json');
const { external, change } = addresses;

const rewire = require('rewire');
const transactions = rewire('../../src/utils/transactions.js');

const serializeTransactions = transactions.__get__('serializeTransactions');

describe('transactions', function() {
	describe('#serializeTransactions', function() {
		const txs = serializeTransactions(original, external, change);
		// Testing expected tx 'type' attributes
		assert.strictEqual(txs[4].type, 'received');
		assert.strictEqual(txs[3].type, 'moved');
		assert.strictEqual(txs[2].type, 'moved');
		assert.strictEqual(txs[1].type, 'moved');
		assert.strictEqual(txs[0].type, 'sent');
		// Testing expected balance
		assert.strictEqual(txs[4].totalValue, 1000000);
		assert.strictEqual(txs[3].totalValue, 997288);
		assert.strictEqual(txs[2].totalValue, 994802);
		assert.strictEqual(txs[1].totalValue, 989830);
		assert.strictEqual(txs[0].totalValue, 884858);
	});
});