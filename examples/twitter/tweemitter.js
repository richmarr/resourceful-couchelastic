/*
	Twitter stream emitter
*/
var https = require('https'),
	events = require('events'),
	querystring = require('querystring');

// @param params Object {track:'WhatYouFindInLadiesHandbags,codeken2011'}
// @param auth Object {username:'foo',password:'bar'}
var Tweemitter = module.exports.Tweemitter = function( params, auth ){

	events.EventEmitter.call(this);
	var self = this;
	
	// Basic auth: "stream.twitter.com/1/statuses/filter.json?track="
	https.get({ 
		host:'stream.twitter.com',
		port:443,
		path:'/1/statuses/filter.json?'+querystring.stringify(params),
		headers:{ authorization:new Buffer(auth.username+":"+auth.password).toString("base64") }
	},function(res){

		res.on('data',function(data){
			try {
				var tweetJSON = data.toString().split('\n');
				for ( var i = 0; i < tweetJSON.length; i++ ){
					var tweet = JSON.parse(tweetJSON[i]);
					self.emit('tweet',tweet);
				}
			} catch (e){
				// meh
			}
		})
	});

};
Tweemitter.prototype = new events.EventEmitter();
