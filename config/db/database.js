var Logger = require('./../logger.js');

var env = (process.env.NODE_ENV == undefined) ? 'development' : process.env.NODE_ENV;
var databaseConfiguration = require('./databaseConfig.js')[env];

var mongoose = require('mongoose');

mongoose.connect('mongodb://' + databaseConfiguration.host.toString() +
                 ":" + databaseConfiguration.port +
                 "/" + databaseConfiguration.database)

var db = mongoose.connection;


db.on('error', function(err){	  
    Logger.error(['mongodb', 'connection error'], err.message + '\n' + err.stack);        
})

db.on('open', function(cb){
    Logger.info(['mongodb'], "Database connection initialized successfully.")
})

module.exports.db = db;
module.exports.mongoose = mongoose;

