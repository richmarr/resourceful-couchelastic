
var Couchdb = require('resourceful').engines.Couchdb,
	elastical = require('elastical'),
	Elasticsearch = require('resourceful-elasticsearch').Elasticsearch,
	resourceful = require('resourceful');

var Couchelastic = exports.Couchelastic = resourceful.engines.Couchelastic = function Couchelastic(config) {

	this.config = config || {};
	if ( !this.config.host ) this.config.host = '127.0.0.1';
	if ( !this.config.port ) this.config.port = 5984;
	Couchdb.apply(this,arguments);
	this.index = config.database || config.index || resourceful.env;

	this.elasticsearch = new Elasticsearch({index:this.index});
	/*this.client = new(elastical.Client)( config.host || config.uri || '127.0.0.1', {
		port:  config.port || 9200,
		timeout:   config.timeout || false
	});*/
	this.client = this.elasticsearch.client;
};
console.error("!",Couchelastic);
Couchelastic.prototype.constructor = Couchdb;

console.error("!1");
Couchelastic.prototype.protocol = 'couchelastic';

Couchelastic.prototype.search = Elasticsearch.prototype.search;

Couchelastic.prototype.find = function(){
	this.elasticsearch.find.apply( this.elasticsearch, arguments );
};

Couchelastic.prototype.sync = function ( factory, callback ) {
	var self = this;
	self.client.createIndex( self.index, function (err) {
		factory._design = addFilter( factory._design, factory.resource );
		Couchdb.prototype.sync.call( self, factory, function(err){
			if (err) return callback(err);
			self.elasticsearch.sync( factory, function(err){
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
/*
client.putRiver( {name:type}, {
		type : 'couchdb',
		couchdb : {
			host : env.db.server,
			port : env.db.port,
			db : env.db.name,
			filter : 'celeriac/'+filter,
			filter_params : filterParams
		},
		index : {
			index : 'celeriac',
			type : type,
			bulk_size : "100",
			bulk_timeout : "10ms"
		}
	}, callback );
*/
for ( var prop in Couchdb.prototype ){
	if ( !Couchelastic.prototype[prop] ) Couchelastic.prototype[prop] = Couchdb.prototype[prop]
}

function addFilter( _design, resource ){
	var design = _design || {};
	design.filters = design.filters || {};
	design.filters.couchelastic = "function(doc, req) { return doc.resource == '"+resource+"'; }";
	return design;
}
