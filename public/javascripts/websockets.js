var _BD = _BD || {};

_BD = (function($, window, document, BD) {
    BD.Message = {
        create: function(params, type){
            if(type == undefined)
                type = 'status';

            var messageParams = {type: type};
            $.extend(messageParams, params);
            return messageParams;
        },

        update: function(msg){
            $('#status-msg').html(msg);
        },

        updateDataContainer: function(data){
            $('#data-container').html(data);
        },

        handle: function(msg){
            var self = this;

            if(msg.data) {
                var msgData = JSON.parse(msg.data);
                var type = msgData.type;

                if (type == 'findNearByResponse')
                    self.handleNearByResponse(msgData);
                else if(type == 'NearbyResponseUpdate')
                    self.handleNearByResponseUpdate(msgData);
            }
        },

        handleNearByResponse: function(msg){

           BD.Message.update('Done. Near by stops are: <br> (Info Refreshed every 10s)');
           var self = this;
           var htmlString = "";
           for(var i = 0; i < msg.stops.length; i ++ ){
               var elementHtml = "" +
                               "<div data-id=" + msg.stops[i].tag + " data-agency-tag=" + msg.stops[i].agencyTag + " class='stop-elem'>" +
                                   "<p><u>" + msg.stops[i].title + "</u></p>" +
                                   "<p class='predictions'></p>" +
                                   "<p class='last-updated'></p>" +
                               "</div>";

               htmlString += "" + elementHtml + " <br/>"

           }
           self.updateDataContainer(htmlString);

        },

        handleNearByResponseUpdate: function(msg){
            if(msg.data.length > 0){
                var stopTag = msg.data[0].stopTag;
                var predictionsHTML = "";

                for(var i = 0;  i < msg.data.length; i ++ ){
                    predictionsHTML += "<p><strong> RouteTag: " + msg.data[i].routeTag +
                                       "</strong> by <strong>" + msg.data[i].agencyTitle + "</strong>";
                    predictionsHTML += " <em> (No predictions found.) </em>";
                    if(msg.data[i].dirTitleBecauseNoPredictions)
                        predictionsHTML += "<br>" + msg.data[i].dirTitleBecauseNoPredictions
                    predictionsHTML += "</p><br>";
                }
                var $elem = $('[data-id="' + stopTag + '"]')
                $elem.find('.predictions').html(predictionsHTML);
                $elem.find('.last-updated').html(new Date().toString());

            }

        }

    };

    BD.SocketConnections = {
        initialize: function () {
            var self = this;
            var sockJS;

            try {
                var sockJSUrl = '/echo';

                sockJS = new SockJS(sockJSUrl);
                sockJS.onopen = function () {
                    BD.Message.update('Connection with server established');
                    self.onInitializeCb(sockJS);
                }

                sockJS.onmessage = function (message) {                    ;
                    BD.Message.handle(message);
                }

                sockJS.onclose = function () {
                }
            } catch (e) {
                console.log('error', e);
            }
        },

        onInitializeCb: function (sockConnection) {
            BD.Message.update('Fetching your location...');
            BD.GeoLocation.fetch(function (position) {
                BD.Message.update('Location found.');
                var pos = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };

                BD.Message.update('Finding stops near you...');
                var newMessage = BD.Message.create(pos, 'findNearby');
                sockConnection.send(JSON.stringify(newMessage));
            });
        }
    };

    return BD;
})(jQuery, this, this.document, _BD);