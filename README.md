# resourceful-couchelastic [![Build Status](https://secure.travis-ci.org/richmarr/resourceful-couchelastic.png)](http://travis-ci.org/richmarr/resourceful-couchelastic)

The goal of CouchElastic is to provide seamless full-text and parametric search to Node.js apps, 
accomplished via [Flatiron][2]'s [Resourceful][3] ODM layer and the awesome power of CouchDB and [Elasticsearch][4]. 


## Configuration

Start up an empty instance of CouchDB and an empty instance of Elasticsearch, then do this:

``` js
	var resourceful = require('resourceful'),
		Couchelastic = require('resourceful-couchelastic').Couchelastic;
	
	resourceful.engines.Couchelastic = Couchelastic;  // patch in the engine
	resourceful.use( 'couchelastic', {
		// CouchDB settings
		host : 'localhost', // optional - defaults to localhost
		port : 5984,        // optional - defaults to 5984
		database:'db-name', // required
		search:{
			// Elasticsearch settings
			index:'my-index-name'  // optional - defaults to db name
		}
	});
```

From this point onwards each `Resource` that you define will have its data stored in your specified 
CouchDB cluster and have an Elasticsearch indexing river configured to index the data for searching.

## Define a resource

Assuming you're already defining resources with Resourceful nothing more is required, but there are some additional options you might want to use. 
Everything specified within the options.search is passed straight into ES's Mapping API, allowing you fine-grained control over how that individual 
field is treated in the index.

``` js
	var Creature = resourceful.define('Creature', function(){
		this.string('name',{ required:true });
		this.string('genus');
		this.number('population');
		this.number('legs',{
			required: true,        // validation rules
			minimum: 0,
			search:{               
				type:'integer'       // this tells ES what type of number this is
			}
		});
		this.array('eats',{
			search:{ type:'string' }
		});
		this.string('geography',{
			search:{
				analyzer:'snowball'  // stem words to match word stem rather than exact form.
			}
		});
	});
```

## Synchronise your schema

The `sync()` method saves appropriate CouchDB design documents, Elasticsearch Mapping docs, and sets up an Elasticsearch River from CouchDB for each Resource type.

You can `save()` and `get()` documents to and from CouchDB without syncing, but in order to use `search()` you need to `sync()`



## Searching

Assuming you've defined a Creature as per the Resourceful docs you should be able to search your database in free text like this.

``` js
	Creature.search("fur",function( err, creatures, response ){
		// creatures is a convenient array of Creature objects that match the search
		// response contains the entire ES response including search results and metadata
	});
```

You can also search using the Elasticsearch query DSL, for example the following `fuzzy` query would also match the word "oscar"

``` js
	Actor.search({
		query : {
    		fuzzy : { text : "socar" }	
		}
	},function( err, actors, response ){
		// actors is an array
		// response is the full response containing metadata, e.g. facets
	});
```

Or using Resoureceful's parametric query method `Resourece.find()`

``` js
	Creature.find({
		legs:4,
		eats:"wasps"
	},function( err, creatures, response ){
		// 
	});
```
### Joining

If you have two data types related by a one-to-many foreign key you can do this (many-many not available yet): 

``` js
	Creature.search("name:wolf",function( err, creatures ){
		Genus.join( creatures, function( err, creatures ){
			// creatures now contains:
			//     creature.genus_id - foreign key
			//     creature.genus - linked entity
		});
	});
```

### Security

If some of your Resource data is sensitive you might want to block it from being indexed

``` js
	var Employee = resourceful.define('Employee', function(){
		this.string('name');
		this.number('salary',{search:{index:'no'}});
	});
```



TODO - clean up the object search API and allow faceting etc.

## Installation

``` bash
	npm install resourceful-couchelastic`
```

## Tests

All tests are written with [vows][0] and should be run with [npm][1]:

``` bash
  $ npm test
```

#### Author: Richard Marr
#### License: Apache 2.0


[0]: http://vowsjs.org
[1]: http://npmjs.org
[2]: http://flatironjs.org/
[3]: https://github.com/flatiron/resourceful/
[4]: http://www.elasticsearch.org