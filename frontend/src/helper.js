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
      productsInvolve.length > 0 &&
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

export function formatDateRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startParts = start
    .toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    .split(' ')

  const endParts = end
    .toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    .split(' ')

  const [startMonth, startDay, startYear] = [
    startParts[0],
    startParts[1].replace(',', ''),
    startParts[2]
  ]
  const [endMonth, endDay, endYear] = [
    endParts[0],
    endParts[1].replace(',', ''),
    endParts[2]
  ]

  // Same month and year
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay} - ${endDay}, ${startYear}`
  }

  // Same year, different months
  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
  }

  // Different years
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
}
