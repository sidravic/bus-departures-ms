var sockjs                      = require('sockjs');
var socketServer                = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/0.3.4/sockjs.min.js' });
var socketMessageHandlerService = require('./services/socket_message_handler_service.js');
var PredictionsService          = require('./services/predictions_service.js');
var _                           = require('lodash');
var periodicUpdater             = null;

socketServer.on('connection', function(conn){
    setupHandlers(conn);
})

var setupHandlers = function(conn){
    var self = this;

    this.onResponse = function(err, data){
        if(!err)
            conn.write(JSON.stringify(data));
    },

    this.initPeriodUpdater = function(stops){
        // Ideally should be fired via a timeout rather than
        // an interval
        // Need to figure out a way out to do that in this context;

        periodicUpdater = setInterval(function(){
            PredictionsService.fetch(stops, self.onPredictionsCb);
        }, 20000)
    }

    this.onFoundNearbyStopsCb = function(err, data){
        var self = this;

        var allStops = data.stops;
        PredictionsService.fetch(allStops, self.onPredictionsCb);
        self.initPeriodUpdater(allStops)

        if(err)
            self.onResponse(err, null);
        else
            self.onResponse(null, data);
    },

    this.onPredictionsCb = function(err, data){
        var self = this;


        if(!err) {
            if(!!!(data.body.Error)) {
                var stopTag = data.body.predictions[0].$.stopTag;

                var predictions = _.map(data.body.predictions, function (prediction) {
                    return prediction.$;
                })

                var messageType = 'NearbyResponseUpdate';
                var newMessage = {
                    type: messageType,
                    data: predictions,
                    stopTag: stopTag
                }

                self.onResponse(null, newMessage);
            }
        }

    }

    conn.on('data', function(data){
        socketMessageHandlerService.handle(data, self.onFoundNearbyStopsCb, self.onPredictionsCb);
    });

    conn.on('close', function(){
        clearTimeout(periodicUpdater);
    })

};




module.exports = socketServer;


