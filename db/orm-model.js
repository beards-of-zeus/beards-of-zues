var db = require('./database');
var Sequelize = require('sequelize');


var User = db.define('Users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    notEmpty: true,
    notNull: true
  },
  password: {
    type: Sequelize.STRING,
    notEmpty: true,
    notNull: true
  },
  location: {
    type: Sequelize.STRING
  }
});

var Activity = db.define("Activity", {
  title: {
    type: Sequelize.STRING,
    notEmpty: true,
    notNull: true
  },
  description: {
    type: Sequelize.STRING,
    notEmpty: true,
    notNull: true
  },
  location: {
    type: Sequelize.STRING
  },
  keywords: {
    type: Sequelize.STRING
  }
  //sequelize automatically makes createdAt and updatedAt columns
});

// We don't need create a join table when we're using an ORM 
// Use a method to set relationships
Activity.belongsToMany(User, {through: 'UserActivity'});
User.belongsToMany(Activity, {through: 'UserActivity'});

User.sync().success(function(){
  console.log("User table created!");
});
Activity.sync().success(function(){
  console.log("Activity table created!");
});
db.sync();
