const Product = require("../models/product")
const PurchaseOrder = require("../models/purchase-order")
const Supplier = require("../models/supplier")
const { groupPurchaseByVendor } = require("../services/PurchaseReportService")

module.exports = {
	purchaseByVendor: async (req, res) => {
		try {
			const purchaseOrders = await PurchaseOrder.findAll({
				include: [
					{
						model: Supplier,
						as: 'supplier'
					},
					{
						model: Product,
						as: 'products',
						attributes: ['id']
					}
				]
			})

			const grouped = groupPurchaseByVendor(purchaseOrders)

			res.sendResponse({purchase_by_vendor: grouped}, "Successfully retrieved!")
		} catch (e) {
			console.log(e)
			res.sendError({e}, "Something went wrong!")
		}
	}
}
