const PurchaseOrder = require("../models/purchase-order")

module.exports = {
	purchaseByVendor: async (req, res) => {
		try {
			const purchaseByVendor = await PurchaseOrder.findAll()

			res.sendResponse({purchase_by_vendor: purchaseByVendor}, "Successfully retrieved!")
		} catch (e) {
			console.log(e)
			res.sendError({e}, "Something went wrong!")
		}
	}
}
