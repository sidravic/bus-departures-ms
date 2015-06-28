var Logger    				   = require('./../config/logger.js');
var constants 					 = require('./../config/constants.js');
var events    					 = require('events');
var agencyFetcherEmitter = new events.EventEmitter();
var util      					 = require('util');
var wreck     					 = require('wreck');
var serviceBus 					 = require('./../config/service_bus.js');

var AgencyFetcherService = {
	fetch: function(cb){
		var  agenciesFetchURI = constants.agenciesURI;

		if (cb == undefined)
			cb = function() {}

		wreck.get(agenciesFetchURI, {}, function(err, response, payload){
			if(err)
				cb(err, null);
			else {
				serviceBus.send(constants.Events.agenciesXMLFetched, {
					eventName: constants.Events.agenciesXMLFetched,
					timestamp: Date.now(),
					data: payload})
				Logger.info(["agency_fetcher_service"], constants.Events.agenciesXMLFetched + " triggered");
				cb(null, payload);
				//agencyFetcherEmitter.emit(constants.Events.agenciesXMLFetched, payload);
			}
		});
	}
}

module.exports = AgencyFetcherService;