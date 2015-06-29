var constants  = require('./../config/constants');
var serviceBus = require('./../config/service_bus.js');
var Logger     = require('./../config/logger.js');
var async      = require('async');
var _          = require('lodash');
var util       = require('util');
var Wreck      = require('wreck');

var StopFetcherService = {
    init: function(){
        var self = this;

        serviceBus.listen(constants.Events.RouteListXMLToJSONConverted, {
            durable: true,
            ack: true,
            persistent: true
        }, function(payload){
           Logger.info(['stop_fetcher_service.js'], 'RouteList in JSON arrived');
           self.fetch(payload.data, payload.data.agencyTag );
        });
        Logger.info(['stop_fetcher_service.js'], 'Initialized');
    },

    fetch: function(routeListJSON, agencyTag){
        var self = this;
        var routeList = routeListJSON.data.body.route;
        var agencyTag = agencyTag;
        
        async.each(routeList, function(route){            
            Logger.info(['stop_fetcher_service.js'], agencyTag);
            var routeConfigURI = constants.routesConfigURI + agencyTag + "&r=" + route.$.tag;
            Logger.info(['stop_fetcher_service.js'], routeConfigURI);
            self.fetchStop(routeConfigURI, agencyTag);
        })
    },

    fetchStop: function(routeConfigURI, agencyTag){
        var self = this;
        setTimeout(function(){
            console.log('Timeout Executing...');
            self.makeRequest(routeConfigURI, agencyTag);

        }, constants.RouteConfigRequestInterval)
    },

    makeRequest: function(routeConfigURI, agencyTag){
        Wreck.get(routeConfigURI, {}, function(err, response, payload){
            if(err){
                //send it to another event on the serviceBus;
                return;
            }
            else{
                Logger.info(['stop_fetcher_service.js'], 'RouteConfig fetched ');
                serviceBus.send(constants.Events.StopsFetched, {
                    event: constants.Events.StopsFetched,
                    timestamp: Date.now(),
                    data: payload,
                    meta: {agencyTag: agencyTag}
                });
            }
        });
    }


}

module.exports = StopFetcherService;