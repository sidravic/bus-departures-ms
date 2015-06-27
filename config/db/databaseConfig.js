var config = {
  development: {
      host: 'localhost',
      port: 27017,
      database: 'bus_departures_development'
  },

  staging:{
      host: 'localhost',
      port: 27017,
      database: 'bus_departures_staging'
  },

  production: {
      host: 'localhost',
      port: 27017,
      database: 'bus_departures_production'
  }

}

module.exports = config;