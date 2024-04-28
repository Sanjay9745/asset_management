// models/index.js
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.POSTGRES_CLOUD_URL || 'postgres://postgres:password@localhost:5432/asset_management');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employees = require('./employee')(sequelize, Sequelize);
db.assets = require('./asset')(sequelize, Sequelize);
db.assetCategories = require('./assetCategory')(sequelize, Sequelize);
db.admins = require('./admin')(sequelize, Sequelize);
db.employeeWithAssets = require('./employeeWithAsset')(sequelize, Sequelize);

module.exports = db;
