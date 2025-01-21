const ProductCategory = require("../../models/product-category");
const Supplier = require("../../models/supplier");
const Account = require("../../models/account");
const ProductSetting = require("../../models/product-setting");
const { ProductType, ProductStatus } = require("shared");

module.exports = {
  getProducts: async () => {
    const getRandomDigitBetween = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    const categories = await ProductCategory.findAll();
    const computers = categories.find((cat) => cat.name == "Computers").id;

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

    return [
      {
        name: "Dell Latitude 5320",
        type: ProductType.INVENTORY,
        price: 25000,
        expense_account: expense[getRandomDigitBetween(0, expense.length)],
        income_account: income[getRandomDigitBetween(0, income.length)],
        product_details: {
          stock: 60,
          purchase_description: "This is a sample description",
          sales_description: "This is a sample description",
          status: ProductStatus.ACTIVE,
          is_manually_set_cost: true,
          cost: 20000,
          item_code: "qwertyui",
          product_setting_id:
            product_settings[getRandomDigitBetween(0, product_settings.length)],
        },
        categories: [computers],
        suppliers: suppliers.map((sup) => {
          return {
            id: sup.id,
            cost: 20000,
          };
        }),
      },
    ];
  },
};
