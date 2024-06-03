// transaction enums
module.exports = {
	TransactionTypes: Object.freeze({
		BILL: 1,
		CHECK: 2,
		INVOICE: 3,
		JOURNAL_ENTRY: 4,
		PURCHASE_ORDER: 5,
		SALES_RECIEPT: 6,
		SALES_ORDER: 7
	}),

	PostingType: Object.freeze({
		POSTING: 1,
		NON_POSTING: 2
	})
}