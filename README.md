# resourceful-couchelastic

A hybrid storage engine for the [Resourceful](https://github.com/flatiron/resourceful/) ODM.


## Example

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

## Installation

`npm install resourceful-couchelastic`


## Tests
All tests are written with [vows][0] and should be run with [npm][1]:

``` bash
  $ npm test
```

#### Author: Richard Marr
#### License: Apache 2.0

