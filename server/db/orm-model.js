'use strict';
var db = require('./database');
var Sequelize = require('sequelize');

module.exports = function(){
  var User = db.define('Users', {
    userId: {type: Sequelize.STRING, 
      unique: true, 
      notEmpty: true, 
      notNull: true,
      primaryKey: true
    }, 
    email: Sequelize.STRING,
    picture: Sequelize.STRING,
    name: Sequelize.STRING,
    nickname: Sequelize.STRING
  });

  var Activity = db.define('Activity', {
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
    },
    active: {
      type: Sequelize.BOOLEAN
    }
    //sequelize automatically makes createdAt and updatedAt columns
  });

  // We don't need create a join table when we're using an ORM 
  // Use a method to set relationships
  Activity.belongsToMany(User, {through: 'UserActivity'});
  User.belongsToMany(Activity, {through: 'UserActivity'});
  //Activity.hasOne(User, {as: "Owner"});
  
  // User.sync().success(function () {
  //   console.log('User table created!');
  // });
  // Activity.sync().success(function () {
  //   console.log('Activity table created!');
  // });

  db.sync();
  return {User:User, Activity: Activity};
};
