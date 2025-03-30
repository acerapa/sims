export const getCost = (cost, prd, sup_id) => {
  const sup = prd.suppliers.find((sp) => sp.id == sup_id)

  return cost
    ? cost
    : sup && sup.ProductSupplier && sup.ProductSupplier.cost
      ? sup.ProductSupplier.cost
      : prd.cost
}

export function validateProductStocks(productsModel, products) {
  const productModelIds = productsModel.map((pm) => pm.product_id)
  const productsInvolve = products
    .filter((p) => productModelIds.includes(p.id))
    .map((p) => ({ id: p.id, stock: p.product_details.stock }))

  const errors = {}

  productsModel.forEach((pm) => {
    if (
      pm.quantity > productsInvolve.find((p) => p.id == pm.product_id).stock
    ) {
      errors[pm.product_id] = 'Not enough stock'
    }
  })

  return Object.keys(errors).length > 0 ? errors : null
}

export function checkAddressIfHasValues(address) {
  const values = Object.values(address)
  return values.some((v) => v)
}
