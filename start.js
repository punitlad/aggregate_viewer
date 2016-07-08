var mongo_client = require('mongodb').MongoClient;
var assert = require('assert');
var properties_reader = require('properties-reader');

var properties = properties_reader('./settings.properties');
var aggregate_id_key = properties.get('aggregate.id.key');
var database_connection = properties.get('database.connection');
var table = properties.get('database.eventstore.name')
var aggregate_id = process.argv[2];

mongo_client.connect(database_connection, function(err, db) {
  assert.equal(null, err);

  db.collection('domainevents').find({aggregate_id_key: aggregate_id}).toArray(
    function(err, docs) {
      if (docs.length != 0) {
        console.log(docs[0].payloadType);
      } else {
        console.log("nothing found for " + aggregate_id + "-T_T-");
      }
      db.close();
    });
  }
);
