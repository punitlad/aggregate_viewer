var mongo_client = require('mongodb').MongoClient;
var assert = require('assert');
var properties_reader = require('properties-reader');
var parseString = require('xml2js').parseString;
var util = require('util');

var properties = properties_reader('./settings.properties');
var database_connection = properties.get('database.connection');
var table = properties.get('database.eventstore.name')

mongo_client.connect(database_connection, function(err, db) {
  assert.equal(null, err);

  by_aggregate_id = {};
  aggregate_id = process.argv[2];
  by_aggregate_id[properties.get('aggregate.id.key')] = aggregate_id;

  db.collection(table).find(by_aggregate_id).toArray(
    function(err, docs) {
      if (docs.length != 0) {
        for(var i = 0; i < docs.length; i++) {
          console.log(docs[i].payloadType);
          parseString(docs[i].serializedPayload, function (err, result) {  console.log(util.inspect(result, false, null)) });
        }
      } else {
        console.log("nothing found for " + aggregate_id + "in table " + table);
      }
      db.close();
    });
  }
);
