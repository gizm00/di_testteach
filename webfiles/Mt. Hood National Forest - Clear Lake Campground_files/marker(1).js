/********************************************
 * Author: Yanxin Duan
 * Created on: 3/1/2010
 * Last modified: 3/1/2010
 * Purpose: file to hold utility tools 
 * Usage: 
 * 
 */

	// Create Map and Markers
	function createMarker(ewin_obj,ewin_style,point,html, marker) {
		// ========== Open the EWindow instead of a Google Info Window ==========
		google.maps.event.addListener(marker, "click", function() {
			// deifine height parameters for setting the window height
		    closeAllEWin();			
		    eval(ewin_obj).openOnMarker(marker,html);
		    
		    var ne = map.getBounds().getNorthEast();
		    var y1 = ne.lat();
		    var y0 = map.getCenter().lat();
		 
		    var y2 = point.lat() + 0.9 * (y1-y0);
		    map.panTo(new google.maps.LatLng(y2, point.lng()));
		});
		return marker;
	}
	
   function getRecMarker(rec, point){
	   var loc = point;     
	   var myMarker;
	   var iconimg;
       if(rec.ICONURL==null || rec.ICONURL.length < 1 ) {
    	   myMarker = getGenericRecMarker();
    	   iconimg = hostUrl + rec.LICONURL;
       } else{
    	   var markerImg = hostUrl + rec.ICONURL;
    	   iconimg = hostUrl + rec.LICONURL;
    	   myMarker = createRecMarker(markerImg,false);
       }
       myMarker.setPosition(point);
       myMarker.setTitle(rec.NAME);
       var infoHtml = infoContent(rec, "RECSITE", iconimg);
       var ewinType = "obj_FSrec";
       var ewinStyle = "E_STYLE_FSrec";
       var marker = createMarker(ewinType,ewinStyle,point,infoHtml, myMarker);
       marker.ID = rec.ID;
       return marker;   
  }

   function getPolyMarker(rec, mPoint, mMarker,winType){
    	   var iconurl =  homeUrl + '/img/activity/large/large_000.png';
    	   var infoHtml = infoContent(rec, winType,iconurl);     
           var ewinType = "obj_FSrec";
           var ewinStyle = "E_STYLE_FSrec";
           if(winType == "FS") {
        	   ewinType = "obj_FSyellow";
        	   ewinStyle = "E_STYLE_FSyellow";
           }   
           mMarker.setPosition(mPoint);
           mMarker.setTitle(rec.NAME);
           var marker = createMarker(ewinType,ewinStyle,mPoint,infoHtml, mMarker);
           google.maps.event.addListener(marker, 'mouseover', function(){});
           google.maps.event.addListener(marker, 'click', function(){});
           marker.setTitle(rec.ID);
           return marker;      
      }
     
      function infoContent(attr, infoType, iconImg){
          	var infoHtml = null;  
          	var title = null; 
          	var subtitle = null; 
          	var winbody = null; 
          	var winfooter = null;
          	var logoImg =  homeUrl + '/img/activity/large/large_000.png';
          	if(iconImg!= "")
          		logoImg = iconImg; 
          	if(infoType == 'FS'){
          	        iconW = 60;
          	        iconH= 60;
          		title = attr.NAME ;
           		subtitle = "<label></label><span></span>";
           		winbody = "<p>" + attr.DESCRIPTION + "</p>";
           		winfooter = "Go to the <a href='"+createSiteLink(attr.ISFOREST,attr.SHORTURL,attr.ID) +"'> "+ attr.NAME + " "+" page</a>";
          	} else if(infoType == 'TC'){
          		title = attr.NAME ;
           		subtitle = "<label>Forest:</label><span>Willamette National Forest</span>";
           		winbody = "<p>More contents will be added.<br/>Please check back later.</p>";
           		winfooter = "Go to the <a href='"+createSiteLink(attr.ISFOREST,attr.SHORTURL,attr.ID) +"'>"+attr.NAME +" page.</a>";
            
          	}else if(infoType == 'RD'){
          	//    for ranger district 
          		title = attr.NAME;
           		subtitle = "<label>Forest:</label><span>" + attr.FORESTNAME + "</span>";
           		winbody = "<p>More contents will be added.<br/>Please check back later.</p>";
           		winfooter = "Go to the <a href='"+createSiteLink(attr.ISFOREST,attr.SHORTURL,attr.ID) +"'>"+attr.NAME + " page.</a>";
          	}else if(infoType == 'RECSITE'){
		  	    //    for ranger district 
          		iconW = 60;
          		iconH= 60;
          		title = attr.NAME;   
          		subtitle = "<label></label><span></span>";
           		winbody =  "<div id='ewin_activityList'>"+ getActListHtml(attr.ACTLIST) + "</div><br clear='all' /><p>" + attr.DESCRIPTION + "</p>";
           	    winfooter = "Go to the <a href='"+createSiteLink(attr.ISFOREST,attr.SHORTURL,attr.ID) +"'>"+attr.NAME + " page </a>";
           }         
       	   var html = html_FSyellow(logoImg,iconW,iconH,title,subtitle,winbody,winfooter); 
     	  
     	   return html; 
      }
