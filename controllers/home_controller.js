module.exports.index = {
    description: 'landing page',
    handler: function(request, reply){
        reply.view('home/index', {title: 'Departures'})
    }
}