var Hapi = require('hapi')
var server = new Hapi.Server();
var Logger = require('./config/logger.js');
var util = require('util')
var Routes = require('./config')
var childProcess = require('child_process');

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

	var routeListXML2JSON = require('./services/route_list_xml_2_json_service.js');
	var agencyFetcher = require('./services/agency_fetcher_service.js');
	var xml2json = require('./services/xml_2_json_service.js');
	var agencyUpdater = require('./services/agency_updater_service.js');
	var Agency = require('./models/agency.js');
	var routeFetcher = require('./services/route_fetcher_service.js');
	var serviceBus = require('./config/service_bus.js');
	var constants = require('./config/constants.js');
	var async = require('async');
	// Alternative approach if extremely load intensive

	//var child = childProcess.fork('./services/agency_updater_service.js');
	//child.on('exit', function(){
	//	Logger.info(['app.js'], 'Child Process exited');
	//})
	routeListXML2JSON.init();
	routeFetcher.init();
	agencyUpdater.init();
	Agency.count({}, function(err, _count){
		if (_count == 0)
			agencyFetcher.fetch();
		else{
			Agency.find({}, function(err, agencies){
				async.each(agencies, function(agency){
				   	serviceBus.send(constants.Events.agencyCreated, {
						event: constants.Events.agencyCreated,
						data: agency,
						timestamp: Date.now()
					})
				})
			})
		}
	})
	xml2json.init();
})