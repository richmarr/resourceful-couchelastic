# resourceful-couchelastic

The goal of CouchElastic is to provide seamless full-text and parametric search to Node.js apps, 
accomplished via [Flatiron][3]'s [Resourceful][4] ODM layer and the awesome power of CouchDB and [Elasticsearch][4]. 


## Configuration

Start up an empty instance of CouchDB and an empty instance of Elasticsearch, then do this:

``` js
	var assert = require('assert'),
		resourceful = require('resourceful'),
		Couchelastic = require('../index');

	resourceful.use('couchelastic',{
		database:'couchelastic-sync-test'
	});
```

From this point onwards each `Resource` that you define will have its data stored in your specified 
CouchDB cluster and have an Elasticsearch indexing river configured to index the data for searching.

## Define a resource

Assuming you're already defining resources with Resourceful nothing more is required, but there are some additional optional you might want to use.

### Security

If some of your Resource data is sensitive you might want to block it from being indexed

``` js
	var Employee = resourceful.define('Employee', function(){
		this.string('name');
		this.number('salary',{searchable:false});
	});
```

TODO - maybe just pass through mapping options transparently for flexibility

## Searching

Assuming you've defined a Creature as per the Resourceful docs you should be able to search your database in free text like this.

``` js
	Creature.search("fur",function(err,creatures){
		// creatures is an array of Creature objects that match the search
	});
```

You can also search using the Elasticsearch query DSL

``` js
	Creature.search({
		term:{
			legs:4,
			eats:"wasps"
		}
	},function(err,creatures){
		// creatures is an array of Creature objects that match the search
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