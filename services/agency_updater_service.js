var Agency     = require('./../models/agency.js');
var serviceBus = require('./../config/service_bus.js');
var constants  = require('./../config/constants.js');
var Logger     = require('./../config/logger.js');
var _          = require('lodash');
var async      = require('async');


var AgencyUpdaterService = {
    init: function(){
        var self = this;
        serviceBus.listen(constants.Events.agenciesXMLtoJSONConverted,
                          {durable: true,
                           ack: true,
                           persistent: true
                          }, self.agenciesJSONPayloadArrived)
    },

    agenciesJSONPayloadArrived: function(event){
        var self = this;
        Logger.info(['agency_updater_service.js'], 'JSON agency payload arrived');

        if(event.type == constants.Events.agenciesXMLtoJSONConverted){
            event.handle.ack();

            //major fuck up here in encapsulation
            var agencies = event.data.data.body.agency;

            async.each(agencies, function(agency){
                AgencyUpdaterService.createOrUpdate(agency,
                                                    AgencyUpdaterService.onCreateOrUpdate);
            })
        }else
            event.handle.reject();

    },

    onCreateOrUpdate: function(err, agency) {
        if(err)
            serviceBus.send(constants.Events.agenciesCreateOrUpdateError, err);
        else {
            serviceBus.send(constants.Events.agencyCreated,
                {event: constantsEvents.agencyCreated,
                 timestamp: Date.now(),
                 data: agency
                });
            Logger.info(['agency_updater_service.js'], 'Agency Created');
        }
    },

    createOrUpdate: function(agency, operationStatusCb){
        var _agency = agency.$;
        Agency.findOne({tag: _agency.tag}, null, function(err, agencyExists){
            if(err)
                operationStatusCb(err, null);

            if(!agencyExists)
                var newAgency = new Agency({title: _agency.title,
                                         tag: _agency.tag,
                                         regionTitle: _agency.regionTitle
                                        })

                newAgency.save(function(err, saveStatus){
                    if(err) operationStatusCb(err, null);
                    Logger.info(['agency_updater_service.js', 'Saving agency with tag ' + newAgency.tag]);
                    if(saveStatus) {
                        Logger.info(['agency_updater_service.js', 'Saved! Agency with tag ' + newAgency.tag]);
                        operationStatusCb(null, saveStatus);
                    }
                })
        })
    }



};


//AgencyUpdaterService.init();

module.exports = AgencyUpdaterService;
