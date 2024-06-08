'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')['development']; // force to use development configs
const db = {};

config.port = config.DB_DIALECT == 'postgres' ? 56198 : 3306;

// let sequelize = new Sequelize(config.database, config.username, config.password, config);
let sequelize = new Sequelize(
  {
    dialect: 'postgres',
    host: 'dpg-cpi3f5kf7o1s73bbfdk0-a',
    port: 5432, // Default PostgreSQL port
    username: 'sims_user',
    password: 'bizFE2DbAbLedWzDTxe0pr0yPTgWbK8Y',
    database: 'sims_capn',
  }
);

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
