var Routes = require('./routes.js');

exports.register = function(server, options, next){
    server.route(Routes);
    next();
}

exports.register.attributes = {
    pkg: require('./../package.json')
}