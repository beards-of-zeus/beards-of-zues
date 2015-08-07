var mysql = require('mysql');
var Sequelize = require("sequelize");

var sequelize = new Sequelize("olympus", "root", "", {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;