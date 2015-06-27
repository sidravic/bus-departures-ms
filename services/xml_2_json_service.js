var serviceBus  = require('./../config/service_bus.js');
var constants   = require('./../config/constants.js');
var Logger 	    = require('./../config/logger.js');
var parseString = require('xml2js').parseString;

var XML2JSON = {
	init: function(){
		var self = this;
		self.activateAgencyXMLFetched();
	},

	activateAgencyXMLFetched: function(){
		var self = this;

		serviceBus.listen(constants.Events.agenciesXMLFetched, {
				durable: true,
				ack: true,
				persistent: true},
			function(payload){
				Logger.info(['xml_2_json.js'], 'Payload arrived: ' + payload);
				if (payload.type == constants.Events.agenciesXMLFetched) {
					self.convert2JSON(payload.data, self.agencyXMLConversionDone);
					payload.handle.ack();
				}else
					payload.handle.reject();
			});
	},

	agencyXMLConversionDone: function(agenciesJSON){
		Logger.info(['xml_2_json.js'], 'Agencies XML to JSON parse success!');
		Logger.debug(['xml_2_json.js'], agenciesJSON);
		serviceBus.send(constants.Events.agenciesXMLtoJSONConverted, {
			event: constants.Events.agenciesXMLtoJSONConverted,
			timestamp: Date.now(),
			data: agenciesJSON
		})
	},

	convert2JSON: function(xmlPayload, done){
		Logger.debug(['xml_2_json.js'], 'XML Payload arrived.');
		parseString(xmlPayload.data, {trim: true}, function(err, jsonPayload){
			if(err) {
				serviceBus.send(constants.Events.agenicesXMLParseError, {
					event: constants.Events.agenciesXMLParseError,
					timeStamp: Date.now(),
					xmlPayload: xmlPayload,
					error: err
				});
				Logger.debug(['xml_2_json.js'], 'XML Payload parse error: ' + err.message);
				Logger.debug(['xml_2_json.js'], err.stack);
			}
			else{
				done(jsonPayload);
			}

		})

	}
};


module.exports = XML2JSON;	