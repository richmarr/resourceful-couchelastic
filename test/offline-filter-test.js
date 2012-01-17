var assert = require('assert'),
	vows = require('vows'),
	ceEngine = require('../index');

vows.describe('Resource filter').addBatch({
	"added to Resource.search() queries": {
		topic: function (){
			var design = {};
			return ceEngine.addFilter( design, 'Article' );
		},
		"is a string":function( design ){
			assert.isString( design.filters.couchelastic );
		},
		"outputs the correct docs":function( design ){
			var str = design.filters.couchelastic;
			var filter;
			eval("filter = " + str);
			
			assert.equal( filter({resource:'Article'}), true );
			assert.equal( filter({resource:'Author'}), false );
		}
	}
}).export(module);