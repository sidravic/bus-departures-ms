var mongoose = require('./../config/db/database.js').mongoose;


var stopSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, index: true},
    tag: {type: String, index: { unique: true }},
    title: {type: String, required: true},
    stopId: {type: String, index: true},
    shortTitle: {type: String},
    loc: {type: [Number], index: '2d'},
    agencyTag: {type: String}

})

var Stop = mongoose.model("Stop", stopSchema);

module.exports = Stop;


