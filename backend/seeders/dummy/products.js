const ProductCategory = require("../../models/product-category");
const Supplier = require("../../models/supplier");
const Account = require("../../models/account");
const ProductSetting = require("../../models/product-setting");

module.exports = {
  getProducts: async () => {
    const getRandomDigitBetween = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    const categories = await ProductCategory.findAll();
    const laptops = categories.find((cat) => cat.name == "Laptops").id;
    const mouses = categories.find((cat) => cat.name == "Mouses").id;
    const monitor = categories.find((cat) => cat.name == "Monitors").id;

    const product_settings = (
      await ProductSetting.findAll({
        attributes: ["id"],
      })
    ).map((item) => item.id);

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
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 20000,
          };
        }),
        // purchase_price: 20000,
        price: 25000,
        quantity_in_stock: 60,
        status: "active",
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        category_id: laptops,
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "Logi Mouse",
        brand: "Logi",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 20000,
          };
        }),
        // purchase_price: 20000,
        price: 25000,
        quantity_in_stock: 60,
        status: "active",
        category_id: mouses,
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui12",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "Monitor",
        brand: "Acer",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 20000,
          };
        }),
        // purchase_price: 20000,
        price: 25000,
        quantity_in_stock: 60,
        status: "active",
        category_id: monitor,
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui3",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "Battery",
        brand: "Motorola",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 20000,
          };
        }),
        // purchase_price: 20000,
        price: 25000,
        quantity_in_stock: 60,
        status: "inactive",
        category_id: monitor,
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui4",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
    ];
  },
};
