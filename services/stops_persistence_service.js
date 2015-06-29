var serviceBus = require('./../config/service_bus.js');
var constants  = require('./../config/constants.js');
var Logger     = require('./../config/logger.js');
var async      = require('async');
var Stop       = require('./../models/stop.js');

var StopPersistenceService = {
    init: function(){
        Logger.info(['stop_persistence_service.js'], "Initialized");
        var self = this;

        serviceBus.listen(constants.Events.StopsPersistRequested, {
            ack: true,
            durable: true,
            persistence: true
        }, function(payload){
            Logger.info('Stop JSON payload arrived.')
            if(payload.type == constants.Events.StopsPersistRequested) {
                self.processJSONPayload(payload.data, payload.data.meta.agencyTag)
                payload.handle.ack();
            }else
                payload.handle.reject();
        })

    },

    processJSONPayload: function(stopJSONPayload, agencyTag){
        var stops = stopJSONPayload.data;
        var self = this;
        async.each(stops, function(stop){
            self.saveStop(stop, agencyTag);
        })

    },

    onSaveStop: function(err, stop){
        if(err) {
            Logger.error(['stops_persistence_service.js'], 'stop could not be persisted');
            console.log(err);
        }
        else
            Logger.info(['stops_persistence_service.js'], 'Stop saved.')
    },

    saveStop: function(stop, agencyTag){
        var self = this;
        var _stop = stop.$;
        var locationCords = [_stop.lon, _stop.lat];
        var newStop = new Stop({tag: _stop.tag,
                                title: _stop.title,
                                shortTitle: _stop.shortTitle,
                                loc: locationCords,
                                stopId: _stop.stopId,
                                agencyTag: agencyTag
                              })

        newStop.save(self.onSaveStop);
    }
}

module.exports = StopPersistenceService;