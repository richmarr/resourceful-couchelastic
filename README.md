# resourceful-couchelastic

A hybrid storage engine for the [Resourceful](https://github.com/flatiron/resourceful/) ODM.


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

You can also search using Elasticsearch's query DSL
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

`npm install resourceful-couchelastic`


## Tests
All tests are written with [vows][0] and should be run with [npm][1]:

``` bash
  $ npm test
```

#### Author: Richard Marr
#### License: Apache 2.0

