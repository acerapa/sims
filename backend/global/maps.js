const { TransactionTypes, PostingType } = require('./enums');

module.exports = {
	TransactionTypeMaps: {
		[TransactionTypes.BILL]: {
			name: 'Bill',
			slug: 'bill'
		},
		[TransactionTypes.CHECK]: {
			name: 'Check',
			slug: 'check'
		},
		[TransactionTypes.INVOICE]: {
			name: 'Invoice',
			slug: 'invoice'
		},
		[TransactionTypes.JOURNAL_ENTRY]: {
			name: 'Journal Entry',
			slug: 'journal_entry'
		},
		[TransactionTypes.PURCHASE_ORDER]: {
			name: 'Purchase Order',
			slug: 'purchase_order'
		},
		[TransactionTypes.SALES_ORDER]: {
			name: 'Sales Order',
			slug: 'sales_order'
		},
		[TransactionTypes.SALES_RECIEPT]: {
			name: 'Sales Receipt',
			slug: 'sales_receipt'
		}
	},

	PostingTypeMaps: {
		[PostingType.POSTING]: {
			name: 'Posting'
		},
		[PostingType.NON_POSTING]: {
			name: 'Non-Posting'
		}
	}
}