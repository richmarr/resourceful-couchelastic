var resourceful = require('resourceful'),
	Couchelastic = require('../../index').Couchelastic;

// boilerplate DB config
resourceful.engines.Couchelastic = Couchelastic;
resourceful.use( 'couchelastic', { database:'lnug' });

exports.Tweet = resourceful.define('Tweet',function(){
	this.string('text',{search:{analyzer:'snowball'}})
});


/*
	{
		"contributors":null,
		"place":null,
		"truncated":false,
		"text":"@Alannahcpalmer @broonpagani @corinnepearl wtf??",
		"id_str":"161907056171954176",
		"retweet_count":0,
		"favorited":false,
		"created_at":"Tue Jan 24 20:23:44 +0000 2012",
		"coordinates":null,
		"in_reply_to_screen_name":"Alannahcpalmer",
		"source":"\u003Ca href=\"http:\/\/twitter.com\/#!\/download\/iphone\" rel=\"nofollow\"\u003ETwitter for iPhone\u003C\/a\u003E",
		"geo":null,
		"retweeted":false,
		"in_reply_to_status_id_str":"161906785568038912",
		"in_reply_to_user_id_str":"363852853",
		"in_reply_to_user_id":363852853,
		"user":{
			"default_profile":false,
			"profile_sidebar_border_color":"666666",
			"id_str":"202663545",
			"created_at":"Thu Oct 14 15:08:34 +0000 2010",
			"following":null,
			"profile_use_background_image":true,
			"geo_enabled":false,
			"profile_text_color":"a177ab",
			"description":"",
			"default_profile_image":false,
			"statuses_count":174,
			"profile_background_image_url":"http:\/\/a0.twimg.com\/profile_background_images\/161499508\/x6d03a379f10fe5d048b706f28436cd2.jpg",
			"url":null,
			"show_all_inline_media":false,
			"follow_request_sent":null,
			"favourites_count":2,
			"profile_link_color":"db6995",
			"followers_count":131,
			"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1144675334\/Meeee_normal.jpg",
			"profile_background_image_url_https":"https:\/\/si0.twimg.com\/profile_background_images\/161499508\/x6d03a379f10fe5d048b706f28436cd2.jpg",
			"screen_name":"Mpagani1",
			"time_zone":"Edinburgh",
			"profile_background_color":"d3d9db",
			"protected":false,
			"profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1144675334\/Meeee_normal.jpg",
			"location":"",
			"contributors_enabled":false,
			"profile_background_tile":false,
			"friends_count":328,
			"name":"Monaca Pagani",
			"listed_count":0,
			"profile_sidebar_fill_color":"e5ecee",
			"id":202663545,
			"is_translator":false,
			"lang":"en",
			"verified":false,
			"notifications":null,
			"utc_offset":0
		},
		"in_reply_to_status_id":161906785568038912,
		"id":161907056171954176,
		"entities":{
			"hashtags":[],
			"user_mentions":[
				{"indices":[0,15],"id_str":"363852853","screen_name":"Alannahcpalmer","name":"Alannah Palmer","id":363852853},
				{"indices":[16,28],"id_str":"75591875","screen_name":"BroonPagani","name":"Bruna Pagani","id":75591875},
				{"indices":[29,42],"id_str":"422766745","screen_name":"CorinnePearl","name":"Corinne Smith","id":422766745}
			],
			"urls":[]
		}
	}
	
	var Creature = resourceful.define('Creature');
	Creature.number('legs', {
		required: true,
		minimum: 0,
		maximum: 8,
		assert: function (val) {
			return val % 2 === 0;
		}
	});
*/