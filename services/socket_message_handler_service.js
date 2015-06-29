var _                  = require('lodash');
var NearbyStopServices = require('./nearby_stops_service.js');
var PredictionsService = require('./predictions_service.js');

var SocketMessageHandlerService = {
    handle: function(msg, cb, predictionsCb){
        var ValidMessages = ['findNearby']
        var self = this;
        var incomingMessage = JSON.parse(msg);

        if(_.indexOf(ValidMessages, incomingMessage.type) != -1) {
            self[incomingMessage.type](incomingMessage, cb, predictionsCb);
        }

    },

    findNearby: function(msg, cb, predictionsCb){
        var cords = [msg.lat, msg.lon];
        NearbyStopServices.find(cords, function(err, stops){
            if(err)
                cb(err, null);
            else {
                var msg = {type: 'findNearByResponse',
                           stops: stops };
                cb(null, msg);
            }
        });
    }
}


module.exports = SocketMessageHandlerService