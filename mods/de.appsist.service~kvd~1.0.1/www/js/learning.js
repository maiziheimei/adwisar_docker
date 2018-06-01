var learning = (function($) {
	var eb;
	var learningChart;

	var knowledgeEstimationHandler = function(event) {
        console.log('Received knowledgeEstimationEvent: ', event);
        // Show correct user
        switch(event.userId) {
        	case "daniel.nolte@appsist.de":
        		showUserWithId("Male", "DANIEL NOLTE", "Anlagenbediener");
        		break;
        	case "dana.exter@appsist.de":
        		showUserWithId("Female", "DANA EXTER", "Anlagenführer");
        		break;
        	case "dana.demo@appsist.de":
        		showUserWithId("Female", "DANA DEMO", "Anlagenführer");
        		break;
        	case "doris.demo@appsist.de":
        		showUserWithId("Female", "DORIS DEMO", "Anlagenführer");
        		break;
        	case "daniel.demo@appsist.de":
        		showUserWithId("Male", "DANIEL DEMO", "Anlagenbediener")
        		break;
        	case "dirk.demo@appsist.de":
        		showUserWithId("Male", "DIRK DEMO", "Anlagenbediener");
        		break;
        	default:
        		showUserWithId("Male", "DANIEL NOLTE", "Anlagenbediener");
        }
        // Show seen contents
        var Uebersicht_Roboterzelle = event["b2280e82-2d6f-4888-9edc-6cf5ccc8bd08"] > 0;
        var Detail_Roboterzelle = event["59fc26ff-6339-4f6b-85c3-dfe5914b0f83"] > 0;
        var Montageprozess_Roboterzelle = event["c4bc9f83-aeea-4680-8c79-488b0e7c6e49"] > 0;
        var Basiswissen_Pneumatik = event["file:///static/externalContent/7_Basiswissen_Pneumatik_HM/index.html?skipcheck"] > 0;
        var Sicherheitshinweise_MPS = event["file:///static/externalContent/MPSStationRoboterSicherheitshinweise.pdf"] > 0;
        var Roboter_Ausbaustufe = event["file:///static/externalContent/8_MPS_Station_Montage_mit_Roboter_HM/index.html?skipcheck"] > 0;
        var Verkettete_Montageanalage = event["file:///static/externalContent/WissenselementZelleGesamtExperte.pdf"] > 0;
        var Handbuch_Roboter =  event["file:///static/externalContent/MPSStationRoboterHandbuch.pdf"] > 0;
        showLearningContents(Uebersicht_Roboterzelle, Sicherheitshinweise_MPS, 
			Basiswissen_Pneumatik, Roboter_Ausbaustufe, Verkettete_Montageanalage, Handbuch_Roboter,
			Montageprozess_Roboterzelle, Detail_Roboterzelle);
        // Show knowledge chart
        var process_tuer_offen = Math.min(5, Math.max(0, event["b55be936-8192-42bc-b7f3-cef947b6f4ce"])); 
        var content_uebersicht_roboter = Math.min(5, Math.max(0, event["b2280e82-2d6f-4888-9edc-6cf5ccc8bd08"]));
        var content_pneumatik = Math.min(5, Math.max(0, event["file:///static/externalContent/7_Basiswissen_Pneumatik_HM/index.html?skipcheck"]));
        var content_montage_roboter = Math.min(5, Math.max(0, event["c4bc9f83-aeea-4680-8c79-488b0e7c6e49"]));
        var content_detail_roboter = Math.min(5, Math.max(0, event["59fc26ff-6339-4f6b-85c3-dfe5914b0f83"]));
		var material_pneumatik = Math.min(5, Math.max(0, event["Pneumatikzylinder"]));
		var material_station = Math.min(5, Math.max(0, event["StationMontage"]));
		var process_bauteilverlust = Math.min(5, Math.max(0, event["ba66718d-607c-4c81-82d7-f1a55fbbef3f"]));
        updateEmployeeKnowledge(process_tuer_offen, content_uebersicht_roboter, content_pneumatik, content_montage_roboter, content_detail_roboter,
		        material_pneumatik, material_station, process_bauteilverlust)
    };

    var userOfflineHandler = function(event) {
        console.log('Received userOffline event: ', event);
        showNoLoginScreen();
    };
	
	var init = function() {
		$(document).ready(function(){
			initializeEventbus();
			initiallySetLearningChart();
    		showUserWithId("Female", "Dana Exter", "Anlagenführer");
    		showLearningContents(true, true, true, true, true, true, true, true);
    		showNoLoginScreen();
		});
	};

	function initializeEventbus() {
		if (eb == null || eb.readyState() == vertx.EventBus.CLOSED) {
			eb = new vertx.EventBus('/eventbus');
			
			eb.onclose = function() {
				console.log('Eventbus connection closed!');
				setTimeout(function() {
					console.log('Trying to reinitialize the eventbus ...')
					initializeEventbus();				;
				}, 3000);
			};
			
			eb.onopen = function() {
				console.log('Eventbus connection opened!');
				registerHandlers();
			};
		}
	}
	
    function registerHandlers() {
        eb.unregisterHandler("appsist:services:kvdconnection:knowledgeestimation", knowledgeEstimationHandler);
        eb.registerHandler("appsist:services:kvdconnection:knowledgeestimation", knowledgeEstimationHandler);
        eb.unregisterHandler("appsist:event:userOffline", userOfflineHandler);
        eb.registerHandler("appsist:event:userOffline", userOfflineHandler);
    }

    var showNoLoginScreen = function() {
    	showUserWithId("nologin", "Unbekannter Mitarbeiter", "Unbekannte Tätigkeitsbeschreibung");
    	$("#screen_area").hide();
    }


	var showUserWithId = function(id, username, jobdescription) {
		// Show correct image
		$("#screen_area").show();
		$("#usernologin").hide();
		$("#userMale").hide();
		$("#userFemale").hide();
		$("#user" + id).show();
		// Render username
		$("#user_name").text(username);
		// Render job description
		$("#user_job_description").text(jobdescription);
		// Set learning goal
		var process_tuer_offen, content_uebersicht_roboter, content_pneumatik, content_montage_roboter, content_detail_roboter,
		        material_pneumatik, material_station, process_bauteilverlust;
		if (jobdescription == "Anlagenführer") {
			process_tuer_offen = 5;
			content_uebersicht_roboter = 4;
			content_pneumatik = 4;
			content_montage_roboter = 5;
			content_detail_roboter = 4;
		    material_pneumatik = 4;
		    material_station= 5;
		    process_bauteilverlust = 5;
		} else {
			process_tuer_offen = 2;
			content_uebersicht_roboter = 1;
			content_pneumatik = 1;
			content_montage_roboter = 2;
			content_detail_roboter = 1;
		    material_pneumatik = 1;
		    material_station= 2;
		    process_bauteilverlust = 1;
		}
		updateLearningGoal(process_tuer_offen, content_uebersicht_roboter, content_pneumatik, content_montage_roboter, content_detail_roboter,
		        material_pneumatik, material_station, process_bauteilverlust);
	}

	var showLearningContents = function(Uebersicht_Roboterzelle, Sicherheitshinweise_MPS, 
		Basiswissen_Pneumatik, Roboter_Ausbaustufe, Verkettete_Montageanalage, Handbuch_Roboter,
		Montageprozess_Roboterzelle, Detail_Roboterzelle) {
		
		$("#Uebersicht_Roboterzelle_mH").toggle(Uebersicht_Roboterzelle);
		$("#Uebersicht_Roboterzelle_oH").toggle(!Uebersicht_Roboterzelle);

		$("#Sicherheitshinweise_MPS_mH").toggle(Sicherheitshinweise_MPS);
		$("#Sicherheitshinweise_MPS_oH").toggle(!Sicherheitshinweise_MPS);

		$("#Basiswissen_Pneumatik_mH").toggle(Basiswissen_Pneumatik);
		$("#Basiswissen_Pneumatik_oH").toggle(!Basiswissen_Pneumatik);

		$("#Roboter_Ausbaustufe_mH").toggle(Roboter_Ausbaustufe);
		$("#Roboter_Ausbaustufe_oH").toggle(!Roboter_Ausbaustufe);

		$("#Verkettete_Montageanalage_mH").toggle(Verkettete_Montageanalage);
		$("#Verkettete_Montageanalage_oH").toggle(!Verkettete_Montageanalage);

		$("#Handbuch_Roboter_mH").toggle(Handbuch_Roboter);
		$("#Handbuch_Roboter_oH").toggle(!Handbuch_Roboter);

		$("#Montageprozess_Roboterzelle_mH").toggle(Montageprozess_Roboterzelle);
		$("#Montageprozess_Roboterzelle_oH").toggle(!Montageprozess_Roboterzelle);

		$("#Detail_Roboterzelle_mH").toggle(Detail_Roboterzelle);
		$("#Detail_Roboterzelle_oH").toggle(!Detail_Roboterzelle);
	}

	var initiallySetLearningChart = function() {
		var ctx = document.getElementById("learningChart");
		learningChart = new Chart(ctx, {
		    type: 'radar',
		    data: {
		        labels : ["Tür im laufenden Betrieb geöffnet", " Übersicht: Funktion Roboterzelle", " Basiswissen: Pneumatik", 
		        " Montageprozess in Roboterzelle", "Im Detail: Funktion Roboterzelle",
		        "Pneumatikzylinder ", "Montagestation ",
		        "Bauteilverlust beheben "],
				datasets : [
					{
						label : "Ist-Zustand",
						lineTension: 100,
						borderJoinStyle: "round",
						borderCapStyle: "round",
						data : [0,1,2,3,4,5,1,4],
						borderWidth : "3",
						borderColor : "rgba(237,110,62,1)",
						backgroundColor : "rgba(237,110,62,0.5)"
					},
					{
						label : "Lernziel",
						lineTension: 30,
						borderJoinStyle: "round",
						borderCapStyle: "round",
						data : [3,5,2,4,1,3,0,2],
						borderWidth : "3",
						borderColor : "rgba(137,187,37,1)",
						backgroundColor : "rgba(137,187,37,0.5)"
					}
				]
			},
		    options: {
		    	animation: false,
		    	responsive: false,
		        scale: {
		        	pointLabels: {
		        		fontSize: 14,
		        		fontColor: "white",
		        		fontFamily: "'fira-sans'"
		        	},
		        	angleLines: {
		        		display: false
		        	},
		            ticks: {
		                beginAtZero: true,
		                showLabelBackdrop: true,
		                fontColor: "black",
		                fontFamily: "'fira-sans'",
		                fontSize: 10,
		                fixedStepSize: 1,
		                max: 5
		            },
		            gridLines: {
		            	color: "white",
		            	lineWidth: "1"
		            }
		        },
		        legend: {
		        	position: 'bottom',
		        	labels: {
		        		fontColor: "white",
		        		fontSize: 14,
		        		fontFamily: "'fira-sans'"
		        	}
		        }
		    }
		});
	}

	var updateEmployeeKnowledge = function(process_tuer_offen, content_uebersicht_roboter, content_pneumatik, content_montage_roboter, content_detail_roboter,
		        material_pneumatik, material_station, process_bauteilverlust) {
		learningChart.config.data.datasets[0].data = [process_tuer_offen, content_uebersicht_roboter, content_pneumatik, content_montage_roboter, content_detail_roboter,
			material_pneumatik, material_station, process_bauteilverlust]; 
		learningChart.update();
	}

	var updateLearningGoal = function(process_tuer_offen, content_uebersicht_roboter, content_pneumatik, content_montage_roboter, content_detail_roboter,
		        material_pneumatik, material_station, process_bauteilverlust) {
		learningChart.config.data.datasets[1].data = [process_tuer_offen, content_uebersicht_roboter, content_pneumatik, content_montage_roboter, content_detail_roboter,
		        material_pneumatik, material_station, process_bauteilverlust]; 
		learningChart.update();
	}
	
	return {
		init : init
	} 
})($);