var mongo_client = require('mongodb').MongoClient;
var assert = require('assert');
var properties_reader = require('properties-reader');

var properties = properties_reader('./settings.properties');
var database_connection = properties.get('database.connection');
var table = properties.get('database.eventstore.name')

mongo_client.connect(database_connection, function(err, db) {
  assert.equal(null, err);

  byAggregateId = {};
  aggregate_id = process.argv[2];
  byAggregateId[properties.get('aggregate.id.key')] = aggregate_id;
  console.log(byAggregateId);

  db.collection(table).find(byAggregateId).toArray(
    function(err, docs) {
      if (docs.length != 0) {
        for(var i = 0; i < docs.length; i++) {
          console.log(docs[i].payloadType);
          console.log(docs[i].serializedPayload);
        }
      } else {
        console.log("nothing found for " + aggregate_id + "in table " + table);
      }
      db.close();
    });
  }
);
