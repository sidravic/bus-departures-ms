var serviceBus = require('./../config/service_bus.js');
var constants  = require('./../config/constants.js');
var Logger     = require('./../config/logger.js');
var parseString = require('xml2js').parseString;

var StopsListXMLtoJSON = {
    init: function(){
        Logger.info(['stops_list_xml_2_json_service.js'], 'Initialed');
        var self = this;

        serviceBus.listen(constants.Events.StopsFetched, {
            ack: true,
            durable: true,
            persistent: true
        }, function(payload){
          self.convert2JSON(payload, self.stopListXMLToJSONDone)
        })
    },

    stopListXMLToJSONDone: function(stopListJSON, agencyTag){
        serviceBus.send(constants.Events.StopsPersistRequested, {
            event: constants.Events.StopsPersistRequested,
            data: stopListJSON,
            timestamp: Date.now(),
            meta: {agencyTag: agencyTag}
        })

        Logger.info(['stops_list_xml_2_json_service.js'], 'Stop Persist request sent');
    },

    convert2JSON: function(payload, done){
        var xmlPayload = payload.data;
        var agencyTag = payload.data.meta.agencyTag;

        parseString(xmlPayload.data, {trim: true}, function(err, jsonPayload){
            if (err) {
                // send it to an endpoint on the message bus.
                return;
            }
            else {
                if(Array.isArray(jsonPayload.body.route))
                    done(jsonPayload.body.route[0].stop, agencyTag);
                else {
                    console.log('Irregular object returned');
                    console.log(jsonPayload.body.route);
                }
            }
        })
    }



}

module.exports = StopsListXMLtoJSON;