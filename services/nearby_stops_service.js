var Stop = require('./../models/stop.js');

var NearbyStopsService = {
    find: function(cords, cb){
        Stop.find({loc: {
            $near: cords
        }}).limit(5).exec(function(err, stops){
            console.log(stops);
            if(err)
                cb(err, null);
            else
                cb(null, stops);
        });
    }
};

module.exports = NearbyStopsService;