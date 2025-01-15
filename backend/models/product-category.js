const { DataTypes, Model, Op } = require("sequelize");
const { sequelize } = require(".");

class ProductCategory extends Model {}

ProductCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    general_cat: {
      type: DataTypes.INTEGER,
      references: {
        model: ProductCategory,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

ProductCategory.addHook("beforeBulkDestroy", async (options) => {
  const categories = await ProductCategory.findAll({
    where: options.where,
    include: { model: ProductCategory, as: "sub_categories" },
  });

  await Promise.all(
    categories.map((c) => {
      return ProductCategory.destroy({
        where: {
          id: {
            [Op.in]: c.sub_categories.map((c) => c.id),
          },
        },
      });
    })
  );
});

module.exports = ProductCategory;
