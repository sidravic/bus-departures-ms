var Constants = {
	agenciesURI: 'http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList',
	routeListURI: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=',
	routesConfigURI: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=',
	RouteConfigRequestInterval: 20000,
	predictionsURI: 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=',
	Events: {
		agenciesXMLFetched: 'agenciesXMLFetched',
		agenicesStored: 'agenciesStored',
		agenicesXMLParseError: 'agenciesXMLParseError',
		agenciesXMLtoJSONConverted: 'agenciesXMLtoJSONConverted',
		agenciesCreateOrUpdateError: 'agenciesCreateOrUpdateError',
		agencyCreated: 'agencyCreated',
		routeListFetched: 'routeListFetched',
		RouteListXMLParseError: 'routeListXMLParseError',
		RouteListXMLToJSONConverted: 'RouteListXMLToJSONConverted',
		StopsFetched: 'StopsFetched',
		StopsPersistRequested: 'StopsPersistRequested'
	}
}

module.exports = Constants;