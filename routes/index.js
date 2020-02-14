const express = require('express');
const router = express.Router();

// Get MongoClient
var MongoClient = require('mongodb').MongoClient;

// db url, collection name and db name
const dburl = 'mongodb://localhost:27017';
const dbname = 'employeeDB';
const collname = 'employeeInfo';

var db = null;

MongoClient.connect(dburl, function (err, client) {
  console.log('Connecting Mongo...');
  if (!err) {
    db = client.db(dbname);
  }
});

router.get('/', (req, res) => {
  var collection = db.collection(collname);

  collection.find({}).toArray(function (err, todos) {
    if (!err) {
      res.send(todos);
    }
  });
});

router.post('/post', function (req, res) {
  //console.log(req.body);
  const collection = db.collection(collname);
  res.send(400);
  collection.insertOne(req.body, function (err, result) {
    if (!err) {
      console.log(result);
    }
  });
});

module.exports = router;