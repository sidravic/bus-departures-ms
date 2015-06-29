var _BD = _BD || {};

_BD = (function($, window, document, BD){
    BD.GeoLocation = {
        fetch: function(cb){
            var self = this;

            if (cb == undefined)
                cb = self.onLocation;

            navigator.geolocation.getCurrentPosition(cb);
        },

        onLocation: function(position){
            $.ajax({
                url: '/nearby',
                type: 'GET',
                data:{lat: position.coords.latitude,
                    lon: position.coords.longitude
                },
                success: function(response){
                    console.log(response)
                },
                error: function(errSponse){
                    console.log(errSponse);
                }
            })
        }
    };


    return BD;

})(jQuery, this, this.document, _BD)