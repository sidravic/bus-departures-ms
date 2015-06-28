var Agency     = require('./../models/agency.js');
var serviceBus = require('./../config/service_bus.js');
var constants  = require('./../config/constants.js');
var Logger     = require('./../config/logger.js');
var _          = require('lodash');
var async      = require('async');
var parseString = require('xml2js').parseString;


var RouteListXML2JSON = {
    init: function(){
        var self = this;
        serviceBus.listen(constants.Events.routeListFetched, {
            ack: true,
            durable: true,
            persistent: true
        }, function(payload){
            Logger.info(['route_list_xml_2_json_service.js'], 'RouteList XML Arrived');
            if(payload.type == constants.Events.routeListFetched) {
                payload.handle.ack();
                self.convert2JSON(payload.data, self.routeListXMLConversionDone);
            }
            else
                payload.handle.reject();
        })
    },

    routeListXMLConversionDone: function(routeListJSON){
        Logger.info(['route_lsit_xml_2_json.js'], 'RouteList converted to JSON');

        serviceBus.send(constants.Events.RouteListXMLToJSONConverted, {
            event: constants.Events.RouteListXMLToJSONConverted,
            timestamp: Date.now(),
            data: routeListJSON
        })
    },

    convert2JSON: function(xmlPayload, done){
        Logger.debug(['route_list_xml_2_json_service.js'], 'Route List XML Payload arrived for conversion.');
        debugger;
        parseString(xmlPayload.data, {trim: true}, function(err, jsonPayload){
            if(err) {
                serviceBus.send(constants.Events.RouteListXMLParseError, {
                    event: constants.Events.RouteListXMLParseError,
                    timeStamp: Date.now(),
                    xmlPayload: xmlPayload,
                    error: err
                })
                Logger.error(['route_list_xml_2_json.js'], 'RouteList XML to JSON parse error');
                throw err;
            }else{
                done(jsonPayload);
            }
        })
    }
};


module.exports = RouteListXML2JSON;