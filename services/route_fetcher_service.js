var constants  = require('./../config/constants.js');
var serviceBus = require('./../config/service_bus.js');
var Agency     = require('./../models/agency.js');
var Logger     = require('./../config/logger.js');
var Wreck      = require('wreck')

var RouteFetcherService = {
    init: function(){
        var self = this;
        serviceBus.listen(constants.Events.agencyCreated, {
                durable: true,
                ack: true,
                persistent: true
            },
            function(payload){
                Logger.info(['route_fetcher_service.js', 'Agency Payload Arrived'])
                if(payload.type == constants.Events.agencyCreated){
                    payload.handle.ack();
                    self.fetch(payload.data);
                }else
                    payload.handle.reject();

            })
    },

    fetch: function(agency){
        var routeListURI = constants.routeListURI + agency.data.tag;
        console.log(routeListURI);

        Wreck.get(routeListURI, {}, function(err, response, payload){
            if(err)
                Logger.error(['route_fetcher_service.js'], 'Error in fetching RouteList for ' + agency.tag);
            else {
                Logger.info(['route_fetcher_service.js'], 'RouteList XML Fetched');
                serviceBus.send(constants.Events.routeListFetched, {
                    event: constants.Events.routeListFetched,
                    timestamp: Date.now(),
                    data: payload
                });
            }
        })
    }


};


module.exports = RouteFetcherService;