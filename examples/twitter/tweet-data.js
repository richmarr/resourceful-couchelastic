/*
	Data input stream
*/
var Tweet = require('./tweet').Tweet,
	Tweemitter = require('./tweemitter').Tweemitter,
	auth = require('lnug/env');

var emitter = new Tweemitter({track:'lnug,nodejs'},auth);

emitter.on('tweet',function(data){
	new Tweet(data).save(function(){
		console.log(data.text);
	});
})