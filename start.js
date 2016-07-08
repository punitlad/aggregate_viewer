console.log("starting up aggregate viewer");

var mongo_client = require('mongodb').MongoClient;
var assert = require('assert');

mongo_client.connect("mongodb://localhost:27017/axontrader", function(err, db) {
  assert.equal(null, err);

  db.collection('domainevents').find({aggregateIdentifier: '7f8b296b-3f6c-47cf-b1ce-fcf2bd9d3d64'}).toArray(
    function(err, docs) {
      console.log(docs[0].payloadType);

      db.close();
    });
  }
);
