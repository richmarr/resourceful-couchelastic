var http = require('http'),
	express = require('express'),
	Tweet = require('./tweet').Tweet;


Tweet.sync(function(){

	// Build the connect app and include all the required middleware
	var app = express.createServer();

	app.get('/',function( req, res, next ){
	
		var query = req.query.q || '';
		res.write('<div><form action="/" method="get"><input name="q" value="'+query+'"/></form></div>');
		
		Tweet.search( query, function( err, tweets, data ){
			for ( var i in tweets ){
				res.write("<div><img src='"+tweets[i].user.profile_image_url+"'/>"+tweets[i].text+"</div>");
			}
			res.end();	
		})
		

	});

	app.listen(8000)

});