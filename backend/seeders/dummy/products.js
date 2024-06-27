const ProductCategory = require("../../models/product-category");
const Supplier = require("../../models/supplier");
const Account = require("../../models/account");

module.exports = {
  getProducts: async () => {
    const getRandomDigitBetween = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    const categories = await ProductCategory.findAll();
		const laptops = categories.find(cat => cat.name == "Laptops").id;
		const mouses = categories.find(cat => cat.name == "Mouses").id;

    const suppliers = await Supplier.findAll({
      attributes: ["id"],
    });

    const accounts = await Account.findAll();

    const income = accounts
      .filter((acc) => acc.type == "income")
      .map((acc) => acc.id);
    const expense = accounts
      .filter((acc) => acc.type == "expense")
      .map((acc) => acc.id);

    const types = ["inventory", "non-inventory"];

    return [
      {
        name: "Dell Latitude 5320",
        brand: "Dell",
        type: types[getRandomDigitBetween(0, 1)],
        supplier_ids: suppliers.map((sup) => sup.id),
        purchase_price: 20000,
        selling_price: 25000,
        quantityInStock: 60,
        status: "",
        category_id: laptops,
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui",
        purchase_description: "This is a sample description",
        selling_description: "This is a sample description",
      },
      {
        name: "Logi Mouse",
        brand: "Logi",
        type: types[getRandomDigitBetween(0, 1)],
        supplier_ids: suppliers.map((sup) => sup.id),
        purchase_price: 20000,
        selling_price: 25000,
        quantityInStock: 60,
        status: "",
        category_id: mouses,
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui12",
        purchase_description: "This is a sample description",
        selling_description: "This is a sample description",
      },
    ];
  },
};
