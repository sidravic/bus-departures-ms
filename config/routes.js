var HomeController = require('./../controllers/home_controller.js');
var StopsController = require('./../controllers/stops_controller.js');

var staticHandler = {
    handler: {
        directory: {
            path: 'public/javascripts'
        }
    }
}

var staticCssHandler = {
    handler: {
        directory: {
            path: 'public/css'
        }
    }
}


module.exports = [
    { path: '/static/javascripts/{filename}', method: 'GET', config: staticHandler},
    { path: '/static/css/{filename}', method: 'GET', config: staticCssHandler},
    { path: '/', method: 'GET', config: HomeController.index},
    { path: '/nearby', method: 'GET', config: StopsController.nearby}
]
