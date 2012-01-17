
var Couchdb = require('resourceful').engines.Couchdb,
	elastical = require('elastical'),
	Elasticsearch = require('resourceful-elasticsearch').Elasticsearch,
	resourceful = require('resourceful');

var Couchelastic = exports.Couchelastic = resourceful.engines.Couchelastic = function Couchelastic(config) {

	this.config = config || {};
	if ( !this.config.host ) this.config.host = '127.0.0.1';
	if ( !this.config.port ) this.config.port = 5984;
	Couchdb.apply(this,arguments);
	
	var searchConfig = config.search || {};
	searchConfig.index = searchConfig.index || config.database || resourceful.env;
	this.index = searchConfig.index;
	
	this.elasticsearch = new Elasticsearch(searchConfig);
	
	this.client = this.elasticsearch.client;
};

Couchelastic.prototype.constructor = Couchdb;

Couchelastic.prototype.protocol = 'couchelastic';

Couchelastic.prototype.search = Elasticsearch.prototype.search;

Couchelastic.prototype.find = function(){
	this.elasticsearch.find.apply( this.elasticsearch, arguments );
};

//
// This method pushes the relevant aspects of the data model to CouchDB and Elasticsearch.
//
Couchelastic.prototype.sync = function ( factory, callback ) {
	var self = this;
	// Make sure the index exists in Elasticsearch. 
	// It is acceptable for this to return an error, but there should probably be some more checking here
	self.client.createIndex( self.index, function (err) {
		
		// Make sure each Resource's design includes a couchelastic filter we can access from the change stream
		// This is so that each river can be set up for a single resource so can have different mappings
		factory._design = exports.addFilter( factory._design, factory.resource );
		
		// Now sync the design documents to Couchdb
		Couchdb.prototype.sync.call( self, factory, function(err){
			if (err) return callback(err);
			
			// Sync the mappings to Elasticsearch
			self.elasticsearch.sync( factory, function(err){
				
				// Now create the river for this Resource from CouchDB to Elasticsearch
				self.client.deleteRiver( self.index, factory.resource, function(){
					var river = {
						type:'couchdb',
						couchdb : {
							host : self.config.host,
							port : self.config.port,
							db : self.config.database,
							filter : factory.resource+"/couchelastic"
						},
						index : {
							index : self.index,
							type : factory.resource,
							bulk_size : "100",
							bulk_timeout : "10ms"
						}
					};
					self.client.putRiver( this.index, factory.resource, river, callback );
				});
			});
		});
	})
};

// Pick up any remaining methods from Couchdb engine
for ( var prop in Couchdb.prototype ){
	if ( !Couchelastic.prototype[prop] ) Couchelastic.prototype[prop] = Couchdb.prototype[prop]
}

exports.addFilter = function( _design, resource ){
	var design = _design || {};
	design.filters = design.filters || {};
	design.filters.couchelastic = "function(doc, req) { return doc.resource == '"+resource+"'; }";
	return design;
}
