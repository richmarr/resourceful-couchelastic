Twitter example
===============

This little project is comprised of a couple of processes. 
One listens to the Twitter stream and pushes the incoming tweets into CouchDB & Elasticsearch via a Resourceful Tweet object. 
The second provides an express instance allowing users to search across the resulting dataset via Tweet.search()

Setup
-----

* An instance of CouchDB running on localhost (or elsewhere if you add the correct config)
* CouchDB should have a database created matching the DB configured in ./tweet.js
* An instance of Elasticsearch running, but need not do any configuration
* You need to have installed the project dependencies via npm (i.e. run "npm install" from project root)
* Twitter requires Auth data so you need to pass the Tweemitter an object like this: {username:'bob',password:'foo'} with your own Twitter login. 
By default the example code looks for this via require('lnug/env') so you can put a file that exports that data in ~/.node_modules/lnug/env.js

Testing
-------

   http://localhost:8000/q=hey