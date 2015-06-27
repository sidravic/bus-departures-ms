var Constants = {
	agenciesURI: 'http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList',
	Events: {
		agenciesXMLFetched: 'agenciesXMLFetched',
		agenciesXML2JSONConverted: 'agenciesXML2JSONConverted',
		agenicesStored: 'agenciesStored',
		agenicesXMLParseError: 'agenciesXMLParseError',
		agenciesXMLtoJSONConverted: 'agenciesXMLtoJSONConverted'
	}
}

module.exports = Constants;