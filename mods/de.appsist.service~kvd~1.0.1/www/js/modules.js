/////////////////////////////////////////
//
//  Precache images
//


var numImages=44;

var imgs    = new Array(numImages+1);

var tuer_ja;
var tuer_nein;

var feder_ja;
var feder_nein;

var deckel_ja;
var deckel_nein;

var bauteil_ja;
var bauteil_nein;



var modules = (function($) {
	var eb;

	var ebHandler = function(event) {
        console.log('Received event "' + event.modelId + '".', event);
        switch (event.modelId) {
        	case "machinestateChanged":
        		console.log("Could do something with machinestateChangedEvent here.");
                        console.log("new machine states:" + event.payload.machineState);
                        handleMachineState(event.payload.machineState);
                        break;
            default:
                console.log("No handler for event " + event.modelId);
        }
    };
	
    
    function handleMachineState(stateslist){
            door=contains(stateslist,"Tuer offen");
            deckel=contains(stateslist,"Deckelmagazin leer");
            feder=contains(stateslist,"Federmagazin leer");
            bauteil=contains(stateslist,"Bauteil verloren");
        
            if (contains(stateslist,"Tuer offen")){
                    console.log("tuer offen!");
                    door=true;
            }
                
            showStates(door,feder,deckel,bauteil);
    }
    
    
    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            console.log("compare: " + a[i] + " -> " + obj);
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
                        showModules(1);
                        showStates(false,false,false,false);
                        


                        
                        //showThemAll(36);
                        window.setTimeout(randomModule, 800+getRandomTimeout());
		});
	};

        
        
        
        
        
        
        
        
        
        
        function cacheImages(){
            for (ci=1; ci<numImages+1;ci++){
                imgs[ci]     = new Image(1920,1080);
                imgs[ci].src = "img/modules/comm/comm" + ci + ".png";
            }
            
            pctwidth=471;
            pctheight=592;
            
            tuer_ja=new Image(pctwidth,pctheight);
            tuer_ja.src="img/modules/states/tuer_ja.png";

            tuer_nein=new Image(pctwidth,pctheight);
            tuer_nein.src="img/modules/states/tuer_nein.png";
            
            feder_ja=new Image(pctwidth,pctheight);
            feder_ja.src="img/modules/states/feder_ja.png";
            
            feder_nein=new Image(pctwidth,pctheight);
            feder_nein.src="img/modules/states/feder_nein.png";

            deckel_ja=new Image(pctwidth,pctheight);
            deckel_ja.src="img/modules/states/deckel_ja.png";

            deckel_nein=new Image(pctwidth,pctheight);
            deckel_nein.src="img/modules/states/deckel_nein.png";
            
            bauteil_ja=new Image(pctwidth,pctheight);
            bauteil_ja.src="img/modules/states/bauteil_ja.png"; 
            
            bauteil_nein=new Image(pctwidth,pctheight);
            bauteil_nein.src="img/modules/states/bauteil_nein.png";
            
            
        }
    
        function randomModule(){
            bild=Math.floor(Math.random()*numImages+1);
            showModules(bild);
            
            window.setTimeout(randomModule, getRandomTimeout());
        }
        
        
       // function showThemAll(){
       //     for (j=1;j<37;j++){
       //         console.log("showthem all: " + j);
       //         window.setTimeout(function() {showModules(j);}, 500*j);
       //     }
        // }
        
        function showThemAll(n){
            showModules(n);
            if (n>0){
                window.setTimeout(function() {showThemAll(n-1);}, 20);
            }
        }
        
        function getRandomTimeout(){
            minTimeout=500;
            maxTimeout=1500;
            
            timeout=Math.random()*(maxTimeout-minTimeout)+minTimeout;
            return timeout;
            
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
	
	
	
	
	
    function registerHandlers() {
        eb.unregisterHandler("appsist:event:machinestateChangedEvent", ebHandler);
        eb.registerHandler("appsist:event:machinestateChangedEvent", ebHandler);
    }
    
    
    
    
	function showModules(id) {
            console.log("show slide:" + id);
            document.images["screen"].src = imgs[id].src;
	}

	
	
	
	
	var showStates = function(tuer,feder,deckel,bauteil) {
		
                if (tuer){
                    document.images["tuer"].src = tuer_ja.src;
                }
                else{
                    document.images["tuer"].src = tuer_nein.src;  
                }
                
                if (feder){
                    document.images["feder"].src = feder_ja.src;
                }
                else{
                    document.images["feder"].src = feder_nein.src;  
                }
                
                if (deckel){
                    document.images["deckel"].src = deckel_ja.src;
                }
                else{
                    document.images["deckel"].src = deckel_nein.src;  
                }
                
                if (bauteil){
                    document.images["bauteil"].src = bauteil_ja.src;
                }
                else{
                    document.images["bauteil"].src = bauteil_nein.src;  
                }
                
	}

	
	return {
		init : init
	} 
})($);