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
    const rj45Cable = categories.find((cat) => cat.name == "RJ45 Cables").id;

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
        categories: [laptops],
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
        category_id: [mouses],
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
        category_id: [monitor],
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
        category_id: [monitor],
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui4",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "RJ45 Category 5e (Cat5e) Ethernet Cable",
        brand: "Jadaol",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 60,
          };
        }),
        // purchase_price: 20000,
        price: 60,
        quantity_in_stock: 100,
        status: "active",
        category_id: [rj45Cable],
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui5",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "RJ45 Category 6 (Cat6) Ethernet Cable",
        brand: "Jadaol",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 80,
          };
        }),
        // purchase_price: 20000,
        price: 80,
        quantity_in_stock: 100,
        status: "active",
        category_id: [rj45Cable],
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui6",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "RJ45 Category 6a (Cat6a) Ethernet Cable",
        brand: "Jadaol",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 120,
          };
        }),
        // purchase_price: 20000,
        price: 120,
        quantity_in_stock: 100,
        status: "active",
        category_id: [rj45Cable],
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui7",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "RJ45 Category 7 (Cat7) Ethernet Cable",
        brand: "Jadaol",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 180,
          };
        }),
        // purchase_price: 20000,
        price: 180,
        quantity_in_stock: 100,
        status: "active",
        category_id: [rj45Cable],
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui8",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
      {
        name: "RJ45 Category 8 (Cat8) Ethernet Cable",
        brand: "Jadaol",
        type: types[getRandomDigitBetween(0, 1)],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 300,
          };
        }),
        // purchase_price: 20000,
        price: 300,
        quantity_in_stock: 100,
        status: "active",
        category_id: [rj45Cable],
        product_setting_id:
          product_settings[getRandomDigitBetween(0, product_settings.length)],
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        item_code: "qwertyui9",
        purchase_description: "This is a sample description",
        sale_description: "This is a sample description",
      },
    ];
  },
};
