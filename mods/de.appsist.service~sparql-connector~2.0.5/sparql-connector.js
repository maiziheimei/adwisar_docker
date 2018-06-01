var vertx   = require('vertx');
var eb      = require('vertx/event_bus');
var console = require('vertx/console');
var container =  require('vertx/container');
var config = container.config;
var eventbusPrefix = "appsist:";
load('sparql.js');

// add eventbus handler


var semWikiRequestHandler = function(jsonMessage, replyHandler){
	// extract SparQL Query from message
	var sparqlQuery = jsonMessage.sparql.query;
	// TODO: execute query
	sparqlRequest(sparqlQuery, replyHandler);
	//console.log('request for semantic wiki information arrived:\n'+ jsonMessage);
}

eb.registerHandler(eventbusPrefix+"requests:semwiki", semWikiRequestHandler, function() {
	console.log("semWikiRequestHandler registered in the cluster");
	//console.log("testing sparql-connector");
	//sparqlRequestTest();
});

var timerID = vertx.setPeriodic(60000, function(timerID) {
	if (undefined != config){
		var statusSignal = {"groupId":config.statusSignal.groupId, "serviceId":"sparql-connector", "status":"OK", "created": new Date()};
		eb.publish(config.statusSignal.channel, statusSignal);
		}      
});

function sparqlRequest(sparqlQuery, replyHandler) {
	var request = new SPARQL();
	//console.log("Executing Query:");
	//console.log(sparqlQuery);
	
	request.executeQuery(sparqlQuery, function(queryResult, info){
		//console.log(queryResult); //Json by default
		// return query result
		replyHandler(queryResult);
	} );
}


function sparqlRequestTest(handler) {

	var request = new SPARQL();
	// example for building a SparQL query using JavaScript
	/*
	request
		.variable("?m")
		.prefixe("app", "http://www.appsist.de/ontology/")
		.where("?helperClass", "rdfs:subClassOf*", "app:Maschinencd zustand" )
		.where("app:LoctiteLeer","a","?helperClass")
		.where("?helperClass", "rdfs:subClassOf*", "?supClassH")
		.where("?supClassH", "rdfs:subClassOf*", "?supClass")
		.where("?supClassInst", "a", "?supClass")
		.where("?supClassInst", "app:bedingt", "?m")
		.groupBy("?m")
		.groupBy("?supClass")
		.orderBy("(count(?supClassH)-1)");
	request.execute(function(data, info){
		console.log(data); //Json by default
		console.log(info); //Print hello world
		eb.publish(handler, data);

	});*/
	var queryString = "BASE <http://www.appsist.de/ontology/> PREFIX app: <http://www.appsist.de/ontology/> SELECT DISTINCT ?anlage ?anlagenLabel ?station ?stationLabel WHERE { { ?anlage a app:Anlage . ?station app:isPartOf ?anlage . ?anlage rdfs:label ?anlagenLabel . ?station rdfs:label ?stationLabel FILTER(LANG(?anlagenLabel)='de' && LANG(?stationLabel)='de')  } UNION { ?station a app:Station . ?station rdfs:label ?stationLabel FILTER(LANG(?stationLabel)='de' && NOT EXISTS{?station app:isPartOf ?_})} UNION  {  ?anlage a app:Anlage . ?anlage rdfs:label ?anlagenLabel . FILTER(LANG(?anlagenLabel)='de' && NOT EXISTS{?_ app:isPartOf ?anlage})}}";
	console.log("Sending sparql query: "+queryString);
	request.executeQuery(queryString, function(data, info){
		console.log(data); //Json by default
	} );

}
