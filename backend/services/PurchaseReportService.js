const groupPurchaseByVendor = (purchaseOrders) => {
	const groupedPOByVendor = {}

	purchaseOrders.forEach(po => {
		const supplier = po.supplier

		// Check if the 
		if (!groupedPOByVendor[supplier.id.toString()]) {
			groupedPOByVendor[supplier.id.toString()] = []
		}

		groupedPOByVendor[supplier.id.toString()].push(po)
	})

	return groupedPOByVendor
}

module.exports = {
	groupPurchaseByVendor
}
