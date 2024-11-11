export const getCost = (cost, prd, sup_id) => {
  const sup = prd.suppliers.find((sp) => sp.id == sup_id)

  return cost
    ? cost
    : sup && sup.ProductSupplier && sup.ProductSupplier.cost
      ? sup.ProductSupplier.cost
      : prd.cost
}
