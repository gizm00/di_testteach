/********************************************
 * Author: Yanxin Duan
 * Created on: 3/1/2010
 * Last modified: 3/1/2010
 * Purpose: file to hold utility tools 
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

//****************************************************************************
      function createRecMarker(iconUrl,highlighted){
 	     var iconimg = null;
 	     var transimg = null;
 	     var shadowimg = null;
 	     var recIconSizeLevel_l = 10;
 	     /* med shadow and transparent png's don't exist */
 	    // if(full_level >= recIconSizeLevel_l){
 	     transimg  = homeUrl + "/img/recIcon_transparent.png";
 	     shadowimg = homeUrl + "/img/recIcon_shadow.png";
 	    // }else{      
 	    	 //transimg  = homeUrl + "/img/recIcon_med_transparent.png";
 	         //shadowimg = homeUrl + "/img/recIcon_med_shadow.png";
 	    // }      
 	     
 	     //var myIcon = new GIcon(G_DEFAULT_ICON);
 	     var myMarker = new google.maps.Marker({
 	    	anchorPoint: new google.maps.Point(13,0),
    		shape: {
 	    	 	type: "poly",
 	    	 	coords: [0,0,0,24,25,24,25,0]
    			//type: "rect",
    			//coords: [0,24,30,0]
    		},
    		icon: {
    			anchor: new google.maps.Point(13,35),
    			size: new google.maps.Size(30,35),
    			url: iconUrl
    		},
    		shadow: {
    			size: new google.maps.Size(50,35),
    			url: homeUrl + "/img/activity/shadow/shadow_001.png"
    		}
 	     });
 	     return myMarker; 
 	  }

      function getGenericRecMarker(){    	 
    	  var myIcon = new google.maps.Marker({
    		  anchorPoint: new google.maps.Point(6,0),
    		  shape: {
    		  	type: "poly",
    		  	coords: [0,0,0,12,12,12,12,0]
    	  	  },
    	     icon: {
    	     	anchor: new google.maps.Point(6,6),
    	     	size: new google.maps.Size(18,12),
    	     	url: homeUrl + "/img/rec_icon_med.png"
    	     }
    	  });
    	  //myIcon.transparent = homeUrl + "/img/recIcon_med_transparent.png"; 
    	  return myIcon;
      }
      
      function browserIE() {
    	  var agent = navigator.userAgent.toLowerCase();
    	  if ((agent.indexOf("msie") > -1) && (agent.indexOf("opera") < 1))
    		  return true;
    	  else
    		  return false;
      }
      
      // renders a png image		
      function placePNG(img, imgW, imgH, styleClass, title, rightMargin, topMargin, onclickAction, id){
    	  var returnStr;
    	  var pngMod = false;
    	  if (browserIE() && img.toLowerCase().indexOf(".png") > -1)
    		  pngMod = true;
    	  if (pngMod)
    		  returnStr = '<div ';
    	  else
    		  returnStr = '<img '
    	  		+'src="' + img + '" width="' + imgW +'px" height="' + imgH +'px" ';
    	  if (id != null)
    		  returnStr += "id='" + id + "' ";
    	  if (styleClass != null)
    		  returnStr += "class='" + styleClass + "' ";
    	  if (title != null)
    		  returnStr += "title='" + title +"' ";
    	  if (onclickAction != null)
    		  returnStr += 'onclick="' + onclickAction + '" ';
    	  returnStr += 'style="';
    	  if (rightMargin != null)
			  returnStr += "right:" + rightMargin + "px; ";
		  if (topMargin != null)
			  returnStr += "top:" + topMargin + "px; ";
    	  if (pngMod)
    		  returnStr += 'height:' + imgH + 'px; width:' + imgW + 'px; '
    		  	+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ img+"', sizingMethod='scale'); "
    		  	+ '"></div>';
    	  else
    		  returnStr += '">';
    	  return returnStr;
      }	
      
      function getActListHtml(imgLinks){
    	  var imgs = imgLinks.split(",");
    	  var actHtml = "";
    	  for(var i = 0; i < imgs.length; i++) {
    		  var img =  imgs[i].split(";");
    		  if (img.length > 1) {
    			  var activityName = img[0];
    			  var iconNumber = img[1];
    			  var actimg = contextPath + "/img/activity/list/list_" + iconNumber + ".png";
    			  actHtml += placePNG(actimg, 25, 25, "ewin_png_act", activityName);
    		  }
    		  else
    			  console.log("WARNING: imgs[" + i + "] does not contain a semi-colon (" + imgs[i] + ")");
    	  }  
    	  return actHtml;
      } 

      function createSiteLink(isForest, shortUrl, recid){
    	  if(isForest)
    		  return hostUrl + "/recmain/" + shortUrl + "/recreation";
    	  else
    		  return hostUrl + "/recarea/" + shortUrl + "/recarea/?recid=" + recid;
      }
