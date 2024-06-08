'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')['development']; // force to use development configs
const db = {};

config.port = config.DB_DIALECT == 'postgres' ? 5432 : 3306;

let sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize.authenticate()
  .then(() => {
    fs
      .readdirSync(__dirname)
      .filter(file => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
        );
      })
      .forEach(file => {
        const model = require(path.join(__dirname, file));
        db[model.name] = model;
      });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  })
  .catch((e) => {
    console.error('Unable to connect to the database \n', e);
  })

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
