var Constants = {
	agenciesURI: 'http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList',
	routeListURI: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=',
	Events: {
		agenciesXMLFetched: 'agenciesXMLFetched',
		agenicesStored: 'agenciesStored',
		agenicesXMLParseError: 'agenciesXMLParseError',
		agenciesXMLtoJSONConverted: 'agenciesXMLtoJSONConverted',
		agenciesCreateOrUpdateError: 'agenciesCreateOrUpdateError',
		agencyCreated: 'agencyCreated',
		routeListFetched: 'routeListFetched',
		RouteListXMLParseError: 'routeListXMLParseError'
	}
}

module.exports = Constants;