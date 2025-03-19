const { DataTypes, Model, Op } = require("sequelize");
const { sequelize } = require(".");
const Address = require("./address");

class Customer extends Model {}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Address,
        key: "id",
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    viber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

Customer.beforeBulkDestroy(async (options) => {
  const customers = await Customer.findAll({
    where: options.where,
    attributes: ["id", "address_id"],
  });
  await Address.destroy({
    where: {
      id: {
        [Op.in]: customers.map((c) => c.address_id),
      },
    },
  });
});

module.exports = Customer;
