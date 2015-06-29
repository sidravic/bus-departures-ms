var constants   = require('./../config/constants.js');
var wreck       = require('wreck');
var async       = require('async');
var parseString = require('xml2js').parseString;


var PredictionsService = {
    fetch: function(stops, cb){
        var self = this;
        async.each(stops, function(stop){
            self.fetchPrediction(stop, stops, cb);
        })
    },

    fetchPrediction: function(stop, allStops, cb){
        var predictionsURL = constants.predictionsURI + stop.agencyTag +
                            "&stopId=" + stop.stopId;

        async.waterfall([
           function fetchPredictions(callback){
               wreck.get(predictionsURL, {}, function(err, response, payload){
                   if(err)
                        callback(err);
                   else
                        callback(null, payload);
               });
           },

           function parsePredictions(payload, callback){
                parseString(payload, {trim: true}, function(err, jsonPayload){
                    if(err)
                        callback(err);
                    else
                        callback(null, jsonPayload);
                })

           },

        ], function(err, result){
            if (err)
                cb(err, null);
            else
                cb(null, result, allStops);
        })

    }
}


module.exports = PredictionsService;