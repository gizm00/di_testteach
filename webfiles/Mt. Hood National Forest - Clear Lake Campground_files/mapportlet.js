/********************************************
 * Author: Yanxin Duan
 * Created on: 3/1/2010
 * Last modified: 3/15/2010
 * Purpose: file to LOAD DYANICM REFRESH MARKERS 
 * Usage: 
 * 
 */
   	/**
	 * Protect window.console method calls, e.g. console is not defined on IE
	 * unless dev tools are open, and IE doesn't define console.debug
	 */
	(function() {
	  if (!window.console) {
	    window.console = {};
	  }
	  // union of Chrome, FF, IE, and Safari console methods
	  var m = [
	    "log", "info", "warn", "error", "debug", "trace", "dir", "group",
	    "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
	    "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
	  ];
	  // define undefined methods as noops to prevent errors
	  for (var i = 0; i < m.length; i++) {
	    if (!window.console[m[i]]) {
	      window.console[m[i]] = function() {};
	    }    
	  } 
	})();
	
   var map;
   var modeLevel = 9; 
 
   var obj_FSyellow;
   var obj_FSrec; 
   
   var recList = [];
   var curBox;
   var mapOrigCenter;
   var mapOrigZoom;
   var weatherLayer;
   var photoLayer;
 
   $(document).ready(function() {
   	google.maps.event.addDomListener(window, 'load', loadGoogleMap);
   });
//************************
// Main onload function 
//*********************     
   function loadGoogleMap() {
	   var xys = areaExtent.split(',');
       var psw= new google.maps.LatLng(parseFloat(xys[1]), parseFloat(xys[0]));
       var pne= new google.maps.LatLng(parseFloat(xys[3]), parseFloat(xys[2]));
       var areaBounds = new google.maps.LatLngBounds(psw, pne);
       mapOrigCenter = areaBounds.getCenter();
       map = new google.maps.Map(document.getElementById("gMap"), {
    	   center: mapOrigCenter,
    	   mapTypeControl: true,
    	   mapTypeControlOptions: {
    	   		style:google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    	   		position:google.maps.ControlPosition.TOP_RIGHT,
    	   		mapTypeIds: [	google.maps.MapTypeId.TERRAIN,
    	   		             	google.maps.MapTypeId.SATELLITE,
    	   		             	google.maps.MapTypeId.ROADMAP,
    	   		             	google.maps.MapTypeId.HYBRID
    	   		]
       	   },
       	   zoomControl: true,
       	   zoomControlOptions: {
       		   style: google.maps.ZoomControlStyle.SMALL
       	   },
       	   scaleControl: true,
       	   //mapTypeId: google.maps.MapTypeId.TERRAIN,
       	   mapTypeId: google.maps.MapTypeId.ROADMAP,
       	   scrollwheel: false,
       	   disableDoubleClickZoom: true,
       	   minZoom: 4,
       	   panControl: false
       });
       
       //Make scale control default to imperial units
       var scaleInterval = setInterval(function() {
    	   var scale = $(".gm-style-cc:not(.gmnoprint):contains(' km')");
    	   if (scale.length) {
    	     scale.click();
    	     clearInterval(scaleInterval);
    	   }
    	 }, 100);
       
       var mode = "level";
       google.maps.event.addListenerOnce(map, 'projection_changed', function(){
    	   var zoomLevel = 0;
    	   try{
    		   if (areaBounds != null)
    			   map.fitBounds(areaBounds);
    		   var initlevel = map.getZoom();
    		   mode = checkZoomLevel(initlevel);
        	   if(initlevel > 16) {
        		   zoomLevel = 16;
        	   }
        	   else if(initlevel < 4) {
        		   zoomLevel = 4;
        	   }
        	   else {
        		   zoomLevel = initlevel;
        	   }
           } catch(err){
        	   console.log("error: " + err);
           }
           console.log("zoomLevel: " + zoomLevel);
           map.setZoom(zoomLevel);
           mapOrigZoom = zoomLevel;
           //map.savePosition();
           // Create the EWindows
           var E_STYLE_FSyellow = new EStyle( homeUrl + "/img/","FSyellow_close.gif",new google.maps.Size(16,16,"px","px"),"FSyellow_stem.png",new google.maps.Size(43,39,"px","px"), 4, 20, 39, 7, "FSyellow_top.png", new google.maps.Size(302,34,"px","px"), "FSyellow_mid.png", new google.maps.Size(302,2,"px","px"),"FSyellow_bot.png",new google.maps.Size(302,76,"px","px"),-7,"FSyellow",new google.maps.Point(-60,-1),"obj_FSyellow");	
           var E_STYLE_FSrec    = new EStyle( homeUrl + "/img/","FSrec_close.png",new google.maps.Size(20,20,"px","px"),"FSrec_stem.png",new google.maps.Size(69,49,"px","px"), 30, 47, 53, 27, "FSrec_top.png", new google.maps.Size(304,65,"px","px"), "FSrec_mid.png", new google.maps.Size(304,6,"px","px"),"FSrec_bot.png",new google.maps.Size(304,82,"px","px"),-10,"FSrec",new google.maps.Point(-65,0),"obj_FSrec");	
       	
           obj_FSyellow = new EWindow(map, E_STYLE_FSyellow);
           obj_FSrec = new EWindow(map, E_STYLE_FSrec);
           
           if (!browserIE()) {	//Layer images look too bulky in ie
           		var layerControlDiv = document.createElement('div');
           		var dropdownForm = new layerControl(layerControlDiv, map);
           		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(layerControlDiv);
           
	           //Extra layers
	           var weatherOptions = {
	        		   clickable: false,
	        		   map: map,
	        		   suppressInfoWindows: true,
	        		   temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT,
	        		   windSpeedUnits: google.maps.weather.WindSpeedUnit.MILES_PER_HOUR
	           };
	           weatherLayer = new google.maps.weather.WeatherLayer(weatherOptions);
	           addLayer("Weather", true, dropdownForm);
	    /*	DISABLED 5/6/2014 pending legal approval       
	           var panoramioOptions = {
	        		   clickable: true,
	        		   supressInfoWindows: false
	           };
	           photoLayer = new google.maps.panoramio.PanoramioLayer(panoramioOptions);
	      	   addLayer("Photos", false, dropdownForm);	*/
       	   }
           
           var curBox = map.getBounds(); 
           
           firstLoad(mode, curBox);
           var oldmode = mode;
           google.maps.event.addListener(map, 'zoom_changed', function() {
        	   oldmode = mode
        	   mode = checkZoomLevel(map.getZoom());
           });
           google.maps.event.addListener(map, 'idle', function() {
        	   var wipeAllMarkers = false;
        	   if (mode == "level" && oldmode == "all")
        		   wipeAllMarkers = true;
        	   refreshMarkers(mode,curBox,wipeAllMarkers);
           });
           
       });
   }
   
   function checkZoomLevel(zoomLevel) {
	   if(zoomLevel > modeLevel) {
		   map.setMapTypeId(google.maps.MapTypeId.HYBRID);
		   return "all";
	   } else {
		   map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
		   return "level";
	   }
   }
//**************************************
       function firstLoad(mode,cBox){
           var url = homeUrl + "/MarkerServlet";
           var params = "mode="+mode+"&level="+recLevel +"&fid="+ focusForest + addFilterTag(cBox);
           getMarkers(url, params,false); 
       }

       function refreshMarkers(mode,oBox,wipeAllMarkers){
           	var newBox = map.getBounds();
           	var url = homeUrl + "/MarkerServlet";
    	   	if(oBox != null && (!newBox.equals(oBox))){
    	   		var params = "mode="+mode+"&level="+recLevel +"&fid="+ focusForest + addFilterTag(newBox,oBox);
    	   	 	getMarkers(url, params,wipeAllMarkers); 
    		}
       }
       
       function getMarkers(url, params, wipeAllMarkers){
    	   $("#map_loadingMessage").show();
    	   $.getJSON(url, params, function(jDoc) {
    		   var marker, projnum= jDoc.Results.length; 
    		   recList = removeMarkerOut(recList, wipeAllMarkers);
    		   var initNum = recList.length;
    		   $.each(jDoc.Results, function(i, rec) {
    			   if(rec.X != null && rec.Y != null) {
    				   var point = new google.maps.LatLng(parseFloat(rec.Y),parseFloat(rec.X));	
    				   var aMarker;
    				   if(checkNewID(rec.ID, recList)) {
    					   if(rec.PID==0) {
    						   aMarker = getPolyMarker(rec,point, getFSIConL(), "FS");
    					   } else {
    						   aMarker = getRecMarker(rec, point);
    					   }
    				   }     
    				   if(aMarker != null) {
    					   recList.push(aMarker);
    				   }
    			   }
    		   });	//each
    		   for(var n = initNum; n < recList.length; n++) {
    			   recList[n].setMap(map);
    		   }		
    		   curBox = map.getBounds();
    		   $("#map_loadingMessage").hide();
    	   });
       }
       
    function getFSIConL() {
   		var FSIconL = new google.maps.Marker({
	   		anchorPoint: new google.maps.Point(13,0),
	   		shape: {
	   			type: "poly",
	   			coords: [3,3,13,1,23,3,23,20,18,23,9,23,3,19]
	   		},
	   		icon: {
	   			anchor: new google.maps.Point(13,35),
	   			size: new google.maps.Size(25,35),
	   			url: homeUrl + '/img/activity/marker/marker_000.png'
	   		},
	   		shadow: {
	   			size: new google.maps.Size(50,35),
	   			url: homeUrl + '/img/activity/shadow/shadow_000.png'
	   		}
   		});
   		return FSIconL;
   }
       
   function checkNewID(id, theList){
        var newId = true;
        for(var n = 0; n < theList.length ; n++){ 
             var aID = theList[n].ID;
             if(id == aID) {
            	 newId = false;
            	 break;
             }
        }
        return newId;
   }
   
   function removeMarkerOut(MList, wipeAllMarkers) { 
	   var newList =[];	
	   var env = map.getBounds();
	   var xmin = env.getSouthWest().lng()
	   , ymin = env.getSouthWest().lat()
	   , xmax = env.getNorthEast().lng()
	   , ymax = env.getNorthEast().lat();
	   $.each(MList, function(i, currMarker) {
		   if (wipeAllMarkers) {
			   currMarker.setMap(null);
		   }
		   else {
			   var mxy = currMarker.getPosition();
			   var x = mxy.lng()
			   , y = mxy.lat();
			   if(x > xmin && x < xmax && y > ymin && y <ymax) {
				   newList.push(currMarker);
			   } else {
				   currMarker.setMap(null);
			   }
		   }
	   });
	   return newList;	
   }
   
   function addFilterTag(cBox,oBox){
	   var ftag = "";
	   if(cBox!=null) {
		   ftag += "&nbox="+ cBox;
	   }
	   if(oBox!=null) {
		   ftag += "&cbox="+ oBox;
	   }	  
	   return ftag; 
   }    
   
  function setMapToOriginal() {
	   map.setCenter(mapOrigCenter);
	   map.setZoom(mapOrigZoom);
  }
   
   function layerControl(layerControlDiv, map) {
	 layerControlDiv.className = "layerControl";
     
     var controlUI = document.createElement('div');
     controlUI.id = "layerDiv";
     controlUI.title = 'Toggle additional layers';
     controlUI.innerHTML = 'Layers <img src="https://maps.gstatic.com/mapfiles/arrow-down.png">';
     layerControlDiv.appendChild(controlUI);

     var controlDropdown = document.createElement('div');
     controlDropdown.id = 'dropdownDiv';
     controlDropdown.style.display = 'none';
     layerControlDiv.appendChild(controlDropdown);
     
     var dropdownForm = document.createElement('form');
     controlDropdown.appendChild(dropdownForm);

     google.maps.event.addDomListener(controlUI, 'click', function() {
        controlDropdown.style.display = (controlDropdown.style.display != 'none' ? 'none' : '' );
     });
     
     google.maps.event.addDomListener(controlUI, 'mouseover', function() {
    	 controlUI.style.backgroundColor = 'rgb(235, 235, 235)';
     });
     
     google.maps.event.addDomListener(controlUI, 'mouseout', function() {
    	 controlUI.style.backgroundColor = 'white';
     });
     
     var layerMouseOutTimeout;
     google.maps.event.addDomListener(layerControlDiv, 'mouseout', function() {
    	 layerMouseOutTimeout = setTimeout(function() {
			 controlDropdown.style.display = 'none';
		 }, 1000);
     });
     
     google.maps.event.addDomListener(layerControlDiv, 'mouseover', function() {
    	 clearTimeout(layerMouseOutTimeout);
     });

     return dropdownForm;
   }
   
   function addLayer(layerId, checked, dropdownForm) {
  	 var domInput = document.createElement('input');
  	 domInput.type = "checkbox";
  	 domInput.id = layerId;
  	 domInput.value = layerId;
  	 domInput.onclick = function() {
  		 changeLayer(this.value);
  	 };
  	 if (checked)
  		 domInput.checked = "checked";
  	 dropdownForm.appendChild(domInput);
  	 
  	 var domInputText = document.createElement('span');
  	 domInputText.innerHTML = layerId + "<BR>";
  	 dropdownForm.appendChild(domInputText);
   }
   
   function changeLayer(layerId) {
		if (layerId == "Weather"){
			 if (document.getElementById("Weather").checked == true) {
			   if(weatherLayer.getMap() == null) { weatherLayer.setMap(map); }
			 }
	 
			 if (document.getElementById("Weather").checked == false) {
				 weatherLayer.setMap(null);  /*layersetoff*/
			 }
	 
		}
	 
		if (layerId == "Photos"){
			 if (document.getElementById("Photos").checked == true) {
			   if(photoLayer.getMap() == null) { photoLayer.setMap(map); }
			 }
	 
			 if (document.getElementById("Photos").checked == false) {
				 photoLayer.setMap(null); /*layersetoff*/
			 }
		}
	 
	}
