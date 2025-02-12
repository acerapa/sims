const { DataTypes, Model, Op } = require("sequelize");
const { sequelize } = require(".");
const { ConsoleColors } = require("shared/enums");

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
      unique: false,
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

ProductCategory.addHook("beforeCreate", async (category) => {
  let categories = [];
  if (category.general_cat) {
    categories = await ProductCategory.findAll({
      where: {
        general_cat: category.general_cat,
      },
    });
  } else {
    categories = await ProductCategory.findAll({
      where: {
        general_cat: null,
      },
    });
  }

  const categoryNames = categories.map((c) => c.name);
  if (categoryNames.includes(category.name)) {
    const generalCategory = await ProductCategory.findByPk(
      category.general_cat
    );
    throw new Error(
      `Category ${category.name} already exists in general category ${generalCategory.name}`
    );
  }
});
module.exports = ProductCategory;
