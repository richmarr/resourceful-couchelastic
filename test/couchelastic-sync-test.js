var assert = require('assert'),
    cradle = require('cradle'),
    elastical = require('elastical'),
    vows = require('vows'),
    resourceful = require('resourceful'),
    Couchelastic = require('../index').Couchelastic;

resourceful.env = 'test';

resourceful.engines.Couchelastic = Couchelastic;

resourceful.use( 'couchelastic', {
	database:'couchelastic-sync-test'
});

var Creature; // Set this in module scope so we can refer to it a few times

vows.describe('resourceful/couchelastic/sync').addBatch({
  "Data should be proxied to the CouchDB engine": {
    topic: function () {
      var that = this;
      var db = new(cradle.Connection)().database('couchelastic-sync-test');
      var client = new(elastical.Client)('127.0.0.1', {port:9200});
      client.deleteIndex('couchelastic-sync-test', function () {
        db.destroy(function(){
          db.create(function(){
            Creature = resourceful.define('Creature', function(){
              this.property('legs',Number);
              this.property('tail',Boolean);
              this.property('eaten',Array,{arraytype:'string'});
              this.property('secrets',Array,{ searchable:false, arraytype:'string' });
            });
            var wolf = new Creature({
              legs:4,
              tail:true,
              description:"The gray wolf (Canis lupus) is a member of the Canidae family and also known as the Arctic wolf, common wolf, Mexican wolf, Plains wolf, timber wolf, Tundra wolf."
            });
            wolf.save(that.callback);
          });
        });
      });
    },
    "is created":function(){}
  }
}).addBatch({
  "Replication river should be created to Elasticsearch cluster on the sync event":{
    topic:function(){
      var self = this;
      Creature.sync(function(){
        setTimeout( function(){// HACK - leave time for the river to be created and the data indexed
          Creature.search( "canidae", self.callback );
        }, 2000 ); 
      });
    },
    "Resource should be searchable":function( err, creatures ){
      assert.equal(creatures.length,1);
    }
  }
}).export(module);