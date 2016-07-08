var mongo_client = require('mongodb').MongoClient;
var assert = require('assert');
var properties_reader = require('properties-reader');
var util = require('util');
var parser = require('xml2json');
var prettyjson = require('prettyjson');
var jp = require('jsonpath');

var properties = properties_reader('./settings.properties');
var database_connection = properties.get('database.connection');
var table = properties.get('database.eventstore.name');
var eventName = properties.get('column.event.name');
var eventPayload = properties.get('column.event.payload');

console.log("");
mongo_client.connect(database_connection, function(err, db) {
  assert.equal(null, err);

  by_aggregate_id = {};
  aggregate_id = process.argv[2];
  by_aggregate_id[properties.get('aggregate.id.key')] = aggregate_id;

  db.collection(table).find(by_aggregate_id).toArray(
    function(err, docs) {
      if (docs.length != 0) {
        for(var i = 0; i < docs.length; i++) {
          console.log("event" + i + " \t\t" + jp.query(docs[i], '$..' + eventName));
          var payload = jp.query(docs[i], '$..' + eventPayload);
          var json = parser.toJson(payload[0]);
          console.log("payload \t" + json);
          console.log("");
        }
      } else {
        console.log("nothing found for " + aggregate_id + "in table " + table);
      }
      db.close();
    });
  }
);
