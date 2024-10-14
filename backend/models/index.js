"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")["development"]; // force to use development configs
const db = {};
// const { migrator } = require('../global/helper');

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize
  .authenticate()
  .then(async () => {
    // migration
    // await migrator();

    fs.readdirSync(__dirname)
      .filter((file) => {
        return (
          file.indexOf(".") !== 0 &&
          file !== basename &&
          file.slice(-3) === ".js" &&
          file.indexOf(".test.js") === -1
        );
      })
      .forEach((file) => {
        const model = require(path.join(__dirname, file));
        db[model.name] = model;
      });

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  })
  .catch((e) => {
    console.error("Unable to connect to the database \n", e);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const isColumnExistInTable = async (table, column) => {
  const [results] = await sequelize.query(
    `
    SELECT column_name FROM information_schema.columns
    WHERE table_schema='${config.database}' AND table_name='${table}';
    `
  );

  return results.map((res) => res.COLUMN_NAME).includes(column);
};

const areColumnsExistInTable = async (table, columns) => {
  const [results] = await sequelize.query(
    `
    SELECT column_name FROM information_schema.columns
    WHERE table_schema='${config.database}' AND table_name='${table}';
    `
  );

  const data = {};
  columns.forEach((column) => {
    data[column] = results.map((res) => res.COLUMN_NAME).includes(column);
  });

  return data;
};


/**
 * THIS IS AN IN-PROGRESS FUNCTION! PLEASE DON'T USE IT YET
 * @param {*} table 
 * @param {*} column 
 */
const getColumnConstrains = async (table, column) => {
  const [results] = await sequelize.query(
    `
    SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE table_schema='${config.database}'
    AND table_name='${table}'
    AND REFERENCED_COLUMN_NAME = 'id'
    `
  );
  /**
   * AND REFERENCED_TABLE_NAME IS NOT NULL'
   * AND CONSTRAINT_TYPE = 'FOREIGN KEY'
   */

  console.log(results);
};

db.getColumnConstrains = getColumnConstrains;
db.isColumnExistInTable = isColumnExistInTable;
db.areColumnsExistInTable = areColumnsExistInTable;

module.exports = db;
