var bus = require('servicebus').bus({url: 'amqp://localhost:5672', enabledConfirms: true});
bus.use(bus.package());
bus.use(bus.correlate());
bus.use(bus.retry());

module.exports = bus;