// EWindow.js 
//
//   This Javascript is provided by Mike Williams
//   Blackpool Community Church Javascript Team
//   http://www.blackpoolchurch.org/
//   http://econym.org.uk/gmap/
//
//   This work is licenced under a Creative Commons Licence
//   http://creativecommons.org/licenses/by/2.0/uk/
//
// Version 0.0  Initial version 
// Version 0.1  10/10/2006 Added E_STYLE_7 
// Version 0.2  17/05/2007 Added .isHidden() and .supportsHide()
// Version 0.3  14/09/2007 added .zindex()
// Version 0.4  09/02/2008 moved the window to the G_MAP_FLOAT_PANE
// Version 0.5  16/10/2008 updated the fudge factors

	// Declare E_Styles     	
	var ewinList = new Array("FSyellow","FSrec");

	function EStyle (
			img_path,			// path to images folder 
			imgClose, 		// image used for closing ewindow
			imgCloseSize,		// new GSize(width,height) for imgClose
	  
			pngStem, 			// image used for ewindow stem
			pngStemSize, 		// new GSize(width,height) for stem image
	  
			marginTop, 		// distance between content area and top of top bg image
			marginRight, 		// distance between right side of background images and content area					  
			marginBot, 		// distance between bottom of bottom background image and content area					  
			marginLeft, 		// distance between left side of background images and content area					  
	  
			pngTop, 			// background image - Top 
			pngTopSize, 		// new GSize(width,height) - background image size - Top 
		
			pngMid, 			// background image - Middle
			pngMidSize, 		// new GSize(width,height) - background image size - Middle 
	  
			pngBot, 			// background image - Bottom
			pngBotSize, 		// new GSize(width,height) - background image size - Bottom
	  
			outerMarginDiff, 	// the distance up and to the right of content for the CLOSE button (-)
			boxClass, 			// css class applied to outer-most div container
			boxOffset, 			// new GPoint(
								//			  distance between left of ewindow and left of stem image,
								//			  distance between bottom of ewindow and bottom of stem image)
	  
			eWindow_obj) {		// corresponds to new EWindow() instantiation near map object creation
        this.img_path = img_path;
		this.imgClose = imgClose;
		this.imgCloseSize = imgCloseSize;
		
		this.pngStem = pngStem;
		this.pngStemSize = pngStemSize;
		
		this.marginTop = marginTop;
		this.marginRight = marginRight;
		this.marginBot = marginBot;
		this.marginLeft = marginLeft;
		
		this.pngTop = pngTop;
		this.pngTopSize = pngTopSize;
		
		this.pngMid = pngMid;
		this.pngMidSize = pngMidSize;
		
		this.pngBot = pngBot;
		this.pngBotSize = pngBotSize;
		
        this.boxClass = boxClass;
        this.boxOffset = boxOffset;
		
		this.content_width = pngMidSize.width - marginLeft - marginRight;
		this.outMarginTop = marginTop - outerMarginDiff;
		this.outMarginBot = marginBot - outerMarginDiff;
		this.outMarginRight = marginRight - outerMarginDiff;

		this.eWindow_obj = eWindow_obj;
		  
        // Known fudge factors are:
        // Firefox 1.0, 1.5, 2.0      5, -1
        // Firefox 3.0                4, -1
        // IE 6.0                     0, -1
        // Opera 8.54                 3, -1
        // Opera 9                    4, -1
        // Netscape (7.2, 8.0)        5, -1
        // Safari                     5, -1
        // Chrome                     5, -1        
        
        var agent = navigator.userAgent.toLowerCase();
        var fudge = 5;  // assume Netscape if no match found
       
        if (agent.indexOf("opera/9") > -1) {
          fudge = 4;
        } else if (agent.indexOf("opera") > -1) {
          fudge = 3;
        } else if (agent.indexOf("firefox/3") > -1) {
          fudge = 0;//4;
        } else if (agent.indexOf("firefox") > -1) {
          fudge = 5;
        } else if (agent.indexOf("chrome") > -1) {
          fudge = 5;
        } else if (agent.indexOf("safari") > -1) {
          fudge = 5;
        } else if (agent.indexOf("msie") > -1) {
          fudge = 0;
        }
        this.fudge = fudge;
	}

	function EWindow(map,estyle) {
		// parameters
		this.map=map;
		this.estyle=estyle;
		// internal variables
		this.visible = false;
		// browser - specific variables
		this.ie = false;
		var agent = navigator.userAgent.toLowerCase();
		if ((agent.indexOf("msie") > -1) && (agent.indexOf("opera") < 1)) {
			this.ie = true;
		} else {
			this.ie = false;
		}
		this.div1 = null
		this.div2 = null;
		//Explicitly call setMap on this overlay
		this.setMap(map);
	}
      
	EWindow.prototype = new google.maps.OverlayView();

	EWindow.prototype.onAdd = function() {
		var div1 = document.createElement("div");
		div1.style.position = "absolute";
		div1.className = "ewin_div1";
		div1.style.width = this.estyle.pngTopSize.width+"px";
		this.getPanes().floatPane.appendChild(div1);
		var div2 = document.createElement("div");
		div2.style.position = "absolute";
		div2.style.width = this.estyle.pngStemSize.width+"px";
		this.getPanes().floatPane.appendChild(div2);
		this.div1 = div1;
		this.div2 = div2;
	};

	EWindow.prototype.openOnMap = function(point, html, offset) {
		this.offset = offset||new google.maps.Point(0,0);
        this.point = point;
        
        this.div2.innerHTML = placePNG(this.estyle.img_path + this.estyle.pngStem, this.estyle.pngStemSize.width, this.estyle.pngStemSize.height, "ewin_png_bg");

        var z = google.maps.Marker.MAX_ZINDEX + 1;
        this.div1.style.zIndex = z;
        this.div2.style.zIndex = z+1;
		
		var div1Content = '<div class="' + this.estyle.boxClass + '">';
		var vImg_id = 'png_mid_'+z; // id of middle image to be stretched
		
		// draw the background image markup to var div1Content
		div1Content += placePNG(this.estyle.img_path + this.estyle.pngTop, this.estyle.pngTopSize.width, this.estyle.pngTopSize.height, "ewin_png_bg");
		div1Content += placePNG(this.estyle.img_path + this.estyle.pngMid, this.estyle.pngMidSize.width, this.estyle.pngMidSize.height, "ewin_png_bg", null, null, null, null, vImg_id);
		div1Content += placePNG(this.estyle.img_path + this.estyle.pngBot, this.estyle.pngBotSize.width, this.estyle.pngBotSize.height, "ewin_png_bg");
		div1Content += placePNG(this.estyle.img_path + this.estyle.imgClose, this.estyle.imgCloseSize.width, this.estyle.imgCloseSize.height, "ewin_close", "Close", this.estyle.outMarginRight, this.estyle.outMarginTop, this.estyle.eWindow_obj+'.hide();');		
		div1Content += '<div class="ewin_content" id="ewin_content_'+z+'" style="position: absolute; top:'+ this.estyle.marginTop +'px; width:'+ this.estyle.content_width +'px; left:'+ this.estyle.marginLeft +'px;">'+ html +'</div>';
		div1Content += '</div>';
		
		this.div1.innerHTML = div1Content;
		this.visible = true;
		this.show();
		
		var content_id ='ewin_content_'+z;// text container id
		var content = document.getElementById(content_id); // text container object
		var vImg = document.getElementById(vImg_id); // object of middle image to be stretched
		var textHeight = content.offsetHeight; // get height of content (text)
		var windowHeight = textHeight + this.estyle.marginTop + this.estyle.marginBot; // height of ewindow
		var vImgHeight = windowHeight - this.estyle.pngTopSize.height - this.estyle.pngBotSize.height; 
		vImg.height = vImgHeight; // change height for non IE pngs
		vImg.style.height = vImgHeight; // change height for IE pngs

		this.draw(true);
	};

      EWindow.prototype.openOnMarker = function(marker,html) {
          var vx = marker.getIcon().anchor.x - marker.anchorPoint.x;
          var vy = marker.getIcon().anchor.y - marker.anchorPoint.y;
          this.openOnMap(marker.getPosition(), html, new google.maps.Point(vx,vy));
      };
      

      EWindow.prototype.draw = function(force) {
        if (!this.visible) {
        	return;
        }
        var proj = this.getProjection();
        var p = proj.fromLatLngToDivPixel(this.point);
        this.div2.style.left   = (p.x + this.offset.x) + "px";
        this.div2.style.bottom = (-p.y + this.offset.y -this.estyle.fudge) + "px";
        this.div1.style.left   = (p.x + this.offset.x + this.estyle.boxOffset.x) + "px";
        this.div1.style.bottom = (-p.y + this.offset.y + this.estyle.boxOffset.y) + "px";
      };

      EWindow.prototype.onRemove = function() {
        this.div1.parentNode.removeChild(this.div1);
        this.div2.parentNode.removeChild(this.div2);
        this.div1 = null;
        this.div2 = null;
		this.visible = false;
      };

      EWindow.prototype.copy = function() {
        return new EWindow(this.map, this.estyle);
      };

      EWindow.prototype.show = function() {
        this.div1.style.display="";
        this.div2.style.display="";
		this.visible = true;
      };
      
      EWindow.prototype.hide = function() {
        this.div1.style.display="none";
        this.div2.style.display="none";
		this.visible = false;
      };
      
      EWindow.prototype.isHidden = function() {
        return !this.visible;
      };
      
      EWindow.prototype.supportsHide = function() {
        return true;
      };
      
      
//****************************************************
//  ewin addup
//****************************************************
		function closeAllEWin(){
			// close all the open ewindows
			for(var j=0; j<ewinList.length; j++){
				eval("obj_"+ewinList[j]).hide();
			}
		}
		function html_FSyellow(iconImg, iconW, iconH, title, subtitle, bodyText, ftr) {
			var titleMarginLeft = iconW;
			return '<div class="ewin_content_inner">' +
						'<div class="ewin_hdr">' +
							'<div class="ewin_icon" style="width:'+iconW+'px; height:'+iconH+'px;">' +
								placePNG(iconImg, iconW, iconH) +
							'</div>'+
							'<div class="ewin_title" style="margin-left:'+titleMarginLeft+'px;">' +
								'<h3>'+title+'</h3>' +
							'</div>'+
						'</div>'+
						'<div class="ewin_subtitle">' +	
							subtitle +
						'</div>' +
						'<div class="ewin_body">' +
							bodyText +
						'</div>' + 
						'<div class="ewin_ftr">' +
							ftr +
						'</div></div>';
		}
		
//*********End of Ewin addup ***********************      
