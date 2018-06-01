/////////////////////////////////////////
//
//  Precache images
//

var imgs    = new Array(37);

var tuer_ja;
var tuer_nein;

var feder_ja;
var feder_nein;

var deckel_ja;
var deckel_nein;

var bauteil_ja;
var bauteil_nein;

var steps=new Array(8);
var stepimages=new Array(8);

var haken;
var leer;
var kreis;
var bg;

var nextstep=0;

var processmap={};
var labelmap={};
var negativesteps=[];
var laststep="";

var debugcount=0;
var modules = (function($) {
	var eb;

	var ebHandler = function(event) {
            console.log('Received event "' + event.modelId + '".', event);
            switch (event.modelId) {
                    case "machinestateChanged":
                            break;
                    case "processEvent:processComplete":
                    case "processEvent:processTerminated":
                    case "processEvent:processCancelled":
                        processFinished(event.payload.processId);
                        break;
                default:
                    console.log("No handler for event " + event.modelId);
            }
        
        };
        
        var stepHandler = function(step) {
            console.log('Received step "' + step.stepId ,step);
            newStep(step.stepId, step.stepLabel);
        };
	
    
    function processFinished(pid){
        if (pid=="ba66718d-607c-4c81-82d7-f1a55fbbef3f" || pid == "b55be936-8192-42bc-b7f3-cef947b6f4ce"){
            console.log("pid IS qualified for stop. re-initing..");
            initializeSteps();
        }
        else{
            console.log("pid not qualified for stop");
        }
    }
    function setHead(headText){
        $("p#head").text(headText);
    }
    
    function buildProcessMap(){
        
        //tuer offen prozess
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_8"]=loadimg("processes/tuer/2_tuer_sicherheit.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/db79025a-f26b-478c-a4ae-43f3d27ec1e2"]=loadimg("processes/tuer/4A_tuer_schliessen.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_3"]=loadimg("processes/tuer/3_tuer_pruefen.png");  
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_34"]=loadimg("processes/tuer/10_tuer_reset.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_22"]=loadimg("processes/tuer/20_tuer_kontrollieren.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_58"]=loadimg("processes/tuer/12_tuer_experten.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_31"]=loadimg("processes/tuer/21_tuer_experten.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_46"]=loadimg("processes/tuer/6A_tuer_schluessel.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_48"]=loadimg("processes/tuer/7A_tuer_abschliessen.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_50"]=loadimg("processes/tuer/9A_tuer_platzieren.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_36"]=loadimg("processes/tuer/15B_tuer_roboter_ein.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_17"]=loadimg("processes/tuer/17B_tuer_roboter_start.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_94"]=loadimg("processes/tuer/19_tuer_fehler.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_76"]=loadimg("processes/tuer/11_tuer_fehler.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_70"]=loadimg("processes/tuer/19_tuer_fehler.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_40"]=loadimg("processes/tuer/16B_tuer_fehler.png");
        processmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_64"]=loadimg("processes/tuer/18B_tuer_fehler.png");
        
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_8"]="Sicherheitsanweisung";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_3"]="Tür prüfen";  
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_34"]="Reset durchführen";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_22"]="Prozessdurchlauf kontrollieren";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_58"]="Experten benachrichtigen";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_31"]="Experten benachrichtigen";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_46"]="Türschlüssel holen";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_48"]="Tür abschließen";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_50"]="Türschlüssel platzieren";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_36"]="Robotermotoren einschalten";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_17"]="Roboterprogramm starten";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_94"]="Fehler";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_76"]="Fehler";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_70"]="Fehler";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_40"]="Fehler";
        labelmap["b55be936-8192-42bc-b7f3-cef947b6f4ce/_64"]="Fehler";
        
        //bauteil verloren process
        
        processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_40"]=loadimg("processes/bauteil/2_Bauteil_Sicherheit.png");
        processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_3"]=loadimg("processes/bauteil/3_Bauteil_finden.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_111"]=loadimg("processes/bauteil/6A_bauteil_sensor.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_77"]=loadimg("processes/bauteil/7A_bauteil_verbindung.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_24"]=loadimg("processes/bauteil/10A_bauteil_benachrichtigen.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_42"]=loadimg("processes/bauteil/16B1_bauteil_schluessel.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_44"]=loadimg("processes/bauteil/17B1_bauteil_aufschliessen.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_17"]=loadimg("processes/bauteil/18B_bauteil_entnehmen.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_86"]=loadimg("processes/bauteil/21B2_bauteil_pruefen.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_94"]=loadimg("processes/bauteil/22B2_bauteil_identifizieren.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_97"]=loadimg("processes/bauteil/24B2_bauteil_entfernen.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_50"]=loadimg("processes/bauteil/27B3_1_bauteil_verriegeln.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_11"]=loadimg("processes/bauteil/28_bauteil_qualitaet.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_66"]=loadimg("processes/bauteil/30_bauteil_band.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_20"]=loadimg("processes/bauteil/33C_bauteil_reset.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_55"]=loadimg("processes/bauteil/37C1_bauteil_einschalten.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_56"]=loadimg("processes/bauteil/38C1_bauteil_rob_starten.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_57"]=loadimg("processes/bauteil/39C1_bauteil_pro_starten.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_30"]=loadimg("processes/bauteil/40C_bauteil_kontrollieren.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_79"]=loadimg("processes/bauteil/8A_bauteil_ausrichten.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/ba66718d-607c-4c81-82d7-f1a55fbbef3f/4778835f-9a38-4551-aed5-7a0321245d60"]=loadimg("processes/bauteil/4A_bauteil_fehlerursache.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_68"]=loadimg("processes/bauteil/9A_bauteil_verbinden.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_8"]=loadimg("processes/bauteil/11_bauteil_prozessdurchlauf.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/d4670ef9-281e-4eb8-962a-3067f25de4fc"]=loadimg("processes/bauteil/12B_bauteil_fehler.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/f4b6a54e-c98b-4309-889a-23bb74ec3249"]=loadimg("processes/bauteil/14B1_bauteil_tuer.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/498228fa-90dc-4688-838f-6c7b475eca02"]=loadimg("processes/bauteil/19B2_bauteil_fehler.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_90"]=loadimg("processes/bauteil/23B2_bauteil_ausrichten.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/26c6accb-ddbe-4110-9d6d-1cd0eebc3e1a"]=loadimg("processes/bauteil/26B3_bauteil_verriegeln.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_70"]=loadimg("processes/bauteil/29_bauteil_entsorgen.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/c2b42f41-2f87-4f44-8b18-3ce4b0ea2567"]=loadimg("processes/bauteil/31C_bauteil_starten.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/8619403d-18d7-4769-bad7-ba7452888864"]=loadimg("processes/bauteil/35C_bauteil_anlagenstart.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_34"]=loadimg("processes/bauteil/41C_bauteil_experten.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/4778835f-9a38-4551-aed5-7a0321245d60"]=loadimg("processes/bauteil/4A_bauteil_fehlerursache.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_51"]=loadimg("processes/bauteil/27B3_2_bauteil_platzieren.png");
       processmap["ba66718d-607c-4c81-82d7-f1a55fbbef3f/_22"]=loadimg("processes/bauteil/34C_bauteil_fehler.png");       
        
        //general

        negativesteps = ["b55be936-8192-42bc-b7f3-cef947b6f4ce/_94", "b55be936-8192-42bc-b7f3-cef947b6f4ce/_76", "b55be936-8192-42bc-b7f3-cef947b6f4ce/_70","b55be936-8192-42bc-b7f3-cef947b6f4ce/_40","b55be936-8192-42bc-b7f3-cef947b6f4ce/_64", "ba66718d-607c-4c81-82d7-f1a55fbbef3f/_22"];
        
        console.log("loaded all process images to a map", processmap);

    }
    
    function loadimg(pfad){
            bild=new Image(1920,1080);
            bild.src="img/process/" + pfad;
            return bild;
    }
    
    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == obj) {
                return true;
            }
        }
        return false;
    }
    
    
	var init = function() {
		$(document).ready(function(){
                        console.log("initializing js backend");
			initializeEventbus();
                        cacheImages();
                        initializeSteps();
                        buildProcessMap();
                        document.images["process"].addEventListener('click',testStep);

		});
	};

        
        function newStep(step, label){
            
            addStep(label, kreis);
            

            
            bild=processmap[step];
            if (bild==undefined){
                console.log("No image for pid: " + step);
            }
            else{
                document.images["process"].src = bild.src;
            }
            
            //change image of last step, if it is a positive step
            
            if (!contains(negativesteps,laststep)){
                
                stepimages[nextstep-2]=haken;
                
            }
            else{
                //stepimages[nextstep-2]=kreuz;
                //only for merkel
                stepimages[nextstep-2]=haken;
            }
            
            laststep=step;
            updateTexts();
            
        }
        
        
        
        function initializeSteps(){
            nextstep=0;
                for (var i=0;i<steps.length;i++){
                       steps[i]="";
                       
                       stepimages[i]=new Image(50,56);
                       stepimages[i].src="img/process/leer.png";
                    
                }
            document.images["process"].src = bg.src;
            updateTexts();
            setHead("");
        }
        
        
        
        
        function cacheImages(){

            kreis=new Image(50,56);
            kreis.src="img/process/kreis.png";
            
            leer=new Image(50,56);
            leer.src="img/process/leer.png";
            
            haken=new Image(50,56);
            haken.src="img/process/haken.png";
            
            bg=new Image(1920,1080);
            bg.src="img/process/bg.png";
            
        }
    
        
        
        
        
        
        
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
	
	function addStep(name, bild){
            if (nextstep>=steps.length){
                //history full, need to discard first items
                discardStep();
            }
            steps[nextstep]=name;
            stepimages[nextstep]=bild;
            nextstep++;
            setHead("Historie");
        }
        
        var testStep=function(){
                console.log("added test step");
                var bild;
                
                if (debugcount %2==0){
                    bild=haken;
                }
                else{
                    bild=kreis;
                }
                
                addStep("testschritt" + debugcount++, haken);
                setTimeout(testStep, 3000);
                updateTexts();
        }
	
	function discardStep(){
            for (var di = 1; di < steps.length; di++) {
                steps[di-1]=steps[di];
                stepimages[di-1]=stepimages[di];  
            }
            nextstep--;
        }
	
	
    function registerHandlers() {
        eb.unregisterHandler("appsist:event:machinestateChangedEvent", ebHandler);
        eb.registerHandler("appsist:event:machinestateChangedEvent", ebHandler);
        eb.unregisterHandler("appsist:services:kvdconnection:stepid", stepHandler);
        eb.registerHandler("appsist:services:kvdconnection:stepid", stepHandler);
        
        eb.unregisterHandler("appsist:event:processEvent:processCancelled", ebHandler);
        eb.registerHandler("appsist:event:processEvent:processCancelled", ebHandler);
        eb.unregisterHandler("appsist:event:processEvent:processComplete", ebHandler);
        eb.registerHandler("appsist:event:processEvent:processComplete", ebHandler);
        eb.unregisterHandler("appsist:event:processEvent:processTerminated", ebHandler);
        eb.registerHandler("appsist:event:processEvent:processTerminated", ebHandler);
        
    }
    
    
    
    
	function updateTexts(){
                for (var ti=0;ti<steps.length;ti++){
                        $("p#step" + (ti+1)).text(steps[ti]);
                        document.images["istep" + (ti+1)].src = stepimages[ti].src;
                    
                }
            
        }

	
	return {
		init : init
	} 
})($);