var NearbyStopsService = require('./../services/nearby_stops_service.js');

module.exports.nearby = {
    description: 'Stops nearby',
    handler: function(request, reply){

        var coords = [
            request.query.lat,
            request.query.lon
        ];

        var onNearestStops = function(err, nearByStops){
            reply({nearbyStops: nearByStops}).type('application/json');
        }

        NearbyStopsService.find(coords, onNearestStops);
    }
}