var express = require('express');

var app = express();

app.set('view engine', 'html');
app.use('/', express.static('./public'));

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

module.exports = app;

//require sequelize models
var models = require('./db/orm-model.js');
var models = models();
var User = models.User;
var Activity = models.Activity;

//Insert or update user information in database
app.post('/data/user', function(req, res) {
  'use strict';
  User.upsert({
    userId: req.body.user_id,
    email: req.body.email,
    picture: req.body.picture,
    name: req.body.name,
    nickname:req.body.nickname});
  res.sendStatus(200);
});

app.get('/data/user', function(req, res){
  'use strict';
  res.sendStatus(200);
});

app.post('/data/activities', function(req, res){
  'use strict';
  User.find({
    where: {
      userId : req.body.user_id
    }
  })
  .then(function(user){
    Activity.build({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      keywords: req.body.keywords,
      active: true
    })
    .save()
    .then(function(activity){
      if(user)
        user.addActivity(activity); // links user to activity in junction table
    });
  });
  res.redirect('/');
});

app.get('/data/activities', function(req, res){
  'use strict';
  var iterations = 0;
  Activity.findAll({})
  .then(function(activities){
    activities.reduce(function(list, activity){ 
      activity.getUsers({
        where : {
          userId : {
            ne : req.query.userID
          }//userId
        }//where
      })//getUsers
      .then(function(user){
        if(user.length > 0){
          list.push({id: activity.id, avatar: user[0].picture, 
            user: user[0].name, description: activity.description, title: activity.title,
            keywords: activity.keywords, location: activity.location});
          iterations++;
        }else{
          iterations++;
        }
        if(iterations === activities.length)
          { res.send(list); }
      }); //then(function(user))
      return list;
    }, []); //reduce
  });//then(function(activities))
});//app.get

app.get('/data/userActivities', function(req, res){
  'use strict';
  var iterations = 0;
  Activity.findAll({})
  .then(function(activities){
    activities.reduce(function(list, activity){ 
      activity.getUsers({
        where : {
          userId : req.query.userID //userId
        }//where
      })//getUsers
      .then(function(user){
        if(user.length > 0){
          list.push({id: activity.id, avatar: user[0].picture, 
            user: user[0].name, description: activity.description, title: activity.title,
            keywords: activity.keywords, location: activity.location});
          iterations++;
        }else{
          iterations++;
        }
        if(iterations === activities.length)
          { res.send(list); }
      }); //then(function(user))
      return list;
    }, []); //reduce
  });//then(function(activities))
});//app.get

app.post('/data/toggle', function(req, res){
  'use strict';
  console.log(req.body.activityId);
  Activity.find({
    where: {
      id: req.body.activityId
    }
  })
  .then(function(activity){
    activity.updateAttributes({active: !activity.get('active')});
  })
  res.sendStatus(200);
});