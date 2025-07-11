const groupPurchaseByVendor = (purchaseOrders) => {
	const groupedPOByVendor = []

	purchaseOrders.forEach(po => {
		const supplier = po.supplier
		
		// find index of supplier if already exist
		const index = groupedPOByVendor.findIndex(po => po.supplier.id == supplier.id)

		if (index < 0) {
			groupedPOByVendor.push({
				supplier: supplier,
				pos: [po]
			})
		} else {
			// check if po is already added
			if (!groupedPOByVendor[index].pos.map(p => p.id).includes(po.id)) {
				groupedPOByVendor[index].pos.push(po)
			}
		}

	})

	return groupedPOByVendor
}

module.exports = {
	groupPurchaseByVendor
}
