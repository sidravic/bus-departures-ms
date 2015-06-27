var Hapi = require('hapi')
var server = new Hapi.Server();
var Logger = require('./config/logger.js');
var util = require('util')
var Routes = require('./config')

server.connection({port: 8009});

server.ext('onRequest', function(request, reply){
	Logger.info(["info"], util.inspect(request.url) + " " + request.params + " " + util.inspect(request.payload));
})

var crash = function(err){
	Logger.info(["info"], "Crashing because of " + err.message);
	throw err;
}

server.register([{
	register: Routes,
	options: {}
}], function(err){
	if(err)
		crash(err);
})

server.start(function(){
	Logger.info(["info"], "Server start on port " + server.info.port)
	var db = require('./config/db/database.js');

	var agencyFetcher = require('./services/agency_fetcher_service.js');
	var xml2json = require('./services/xml_2_json_service.js');

	agencyFetcher.fetch();
	xml2json.init();





})