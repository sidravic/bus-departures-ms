var mongoose = require('./../config/db/database.js').mongoose;


var agencySchema = mongoose.Schema({
    id: {type: mongoose.Schema.Type.ObjectId, index: true},
    regionTitle: {type: String, required: true},
    tag: {type: String, required: true, index: true},
    title: {type: String, required: true}
})

var Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;


