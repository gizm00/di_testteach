//Shows an IFRAME inside a lightbox which blocks access to the page.
var wptheme_IFrameLightbox = function ( /*String*/disabledBackgroundClassname, /*String*/borderBoxClassname, /*String*/closeLinkClassname, /*String*/closeString ) {
	// summary: Creates a "lightbox" effect where a partially opaque div is set to cover the entire viewable area of the browser and the content
	//		is displayed in an iframe in approximately the middle of the viewable area.
	// description: Creates a div the size of the viewable area of the browser which is styled using the given "disabledBackgroundClassname". The iframe is
	//		displayed inside another div which is approximately centered and styled according to the given "borderBoxClassname". The content of the iframe is
	//		set using the "setURL" function. The "lightbox" is closed via a text anchor link which is positioned above the top right edge of the border box. The
	//		text displayed is controlled using the "closeString" parameter and the link is styled according to the "closeLinkClassname".
	// disabledBackgroundClassname: the CSS class name to apply to the background div displayed when the lightbox is showing
	// borderBoxClassname: the CSS class name to apply to the border box in the center of the page
	// closeString: the string which will be displayed as the link to close the lightbox
	this.className = "wptheme_IFrameLightbox";
	
	//Declare this here so that any dependency error (e.g. wptheme_HTMLElementUtils not yet being defined)
	//is clear from the beginning (throws an error at construction time instead of runtime). Also, allows
	//for easy substitution of alternate implementations (as long as function names & signatures are the same).
	this._htmlUtils = wptheme_HTMLElementUtils;
	this._debugUtils = wptheme_DebugUtils;
	
	this._initialized = false;
	this.showing = false;
	
	var uniquePrefix = this._htmlUtils.getUniqueId();
	this._backgroundDivId = uniquePrefix + "_lightboxPageBackgroundDiv";
	this._borderDivId = uniquePrefix + "_lightboxBorderDiv";
	this._closeLinkId = uniquePrefix + "_lightboxCloseLink";
	this._iframeId = uniquePrefix + "_lightboxIframe";
	
	// ****************************************************************
	// * Dynamically created DOM elements. 
	// ****************************************************************

	function createDiv(idStr, className, parent ) {
		// summary: Creates a div with the given ID, class, and appends to the given parent node. The display property is set to none by default.
		var div = document.createElement( "DIV" ); 
		div.id = idStr;
		div.className = className;
		div.style.display = "none";
		parent.appendChild( div );
		return div;
	}
	var me = this;
	function createLink(idStr, className, text, parent) {
		// summary: Creates a link with the given ID, class, textContent, and appends it to the given parent node. The display property is set to none
		//		by default. The onclick is set to hide the lightbox.
		var a = document.createElement( "A" );
		a.id = idStr;
		a.className = className;
		a.href = "javascript:void(0);";
		a.onclick = function () { me.hide() };
		a.style.display = "none";
		a.appendChild( document.createTextNode( text ) );
		parent.appendChild( a );
		return a;
	}
	
	function createIFrame( idStr, parent ) {
		// summary: Creates an iframe with the given ID (also used for the name) and appends it to the given parent node.
		var iframe = document.createElement( "IFRAME" );
		iframe.name = idStr;
		iframe.id = idStr;
		//iframe.style.display = "none";
		parent.appendChild( iframe );
		return iframe;
	}
	
	// ****************************************************************
	// * Initialization.
	// ****************************************************************
	
	this._init = function () {
		this._initialized = true;
		//Create the background div.
		createDiv( this._backgroundDivId, disabledBackgroundClassname, document.body );
		//Create the border box div
		createIFrame( this._iframeId, createDiv( this._borderDivId, borderBoxClassname, document.body ));
		//Create the close link.
		createLink( this._closeLinkId, closeLinkClassname, closeString, document.body );
	}
	
	// ****************************************************************
	// * Handling the browser scrolling and resizing dynamically.
	// ****************************************************************

	//Make sure to call any existing onscroll handler.
	var oldScrollFunc = window.onscroll;
	window.onscroll = function (e) {
		if ( me.showing ) {
			me.sizeAndPositionBorderBox();
			//me.sizeBackgroundDisablingDiv();
		}
		
		if ( oldScrollFunc ) {
			if (e) {
				oldScrollFunc(e);
			}
			else  {
				oldScrollFunc();
			}
		}
	}
	
	//Make sure to call any existing onresize handler.
	var oldResizeFunc = window.onresize;
	window.onresize = function (e) {
		if ( me.showing ) {
			me.sizeAndPositionBorderBox();
			me.sizeBackgroundDisablingDiv();
		}
		
		if ( oldResizeFunc ) {
			if (e) {
				oldResizeFunc(e);
			}
			else  {
				oldResizeFunc();
			}
		}
	}

	// ****************************************************************
	// * Main functions for use in the theme.
	// ****************************************************************
	
	this.setURL = function ( /*String*/url ) {
		// summary: Sets the URL displayed by the IFRAME in the lightbox.
		// url: the url to the resource to display
		window.frames[this._iframeId].location = url;
	}
	
	
	
	this.show = function ( /*String?*/url ) {
		// summary: Shows the lightbox above the disabled background div. 
		// url: OPTIONAL -- the url to display in the iframe in the center of the screen 
		if ( !this._initialized ) {
			this._init();
		}
		
		this.showing = true;
		
		this.disableBackground();
		this.showBorderBox();
		if ( url ) { 
			this.setURL( url );
		}		
	}
	
	this.hide = function() {
		// summary: Hides the lightbox and the disabled background div.
		if ( !this._initialized ) {
			this._init();
		}
		
		this.showing = false;
		
		this.enableBackground();
		this.hideBorderBox();
	}
	
	// ****************************************************************
	// * Content border box 
	// ****************************************************************
	this.showBorderBox = function () {
		// summary: Shows and positions the border box which contains the IFRAME.
		var div = document.getElementById( this._borderDivId );
		div.style.display = "block";
		var link = document.getElementById( this._closeLinkId );
		link.style.display = "block";
		
		this.sizeAndPositionBorderBox();
	}
	
	this.sizeAndPositionBorderBox = function () {
		// summary: Sizes and positions the border box which contains the IFRAME.
		var div = document.getElementById( this._borderDivId );
		this._htmlUtils.sizeRelativeToViewableArea( div, 0.60, 0.75 );
		this._htmlUtils.positionRelativeToViewableArea( div, 0.20, 0.12 );
		var link = document.getElementById( this._closeLinkId );
		this._htmlUtils.positionOutsideElementTopRight( link, div );
	}
	
	this.hideBorderBox = function () {
		// summary: hides the border box and IFRAME.
		document.getElementById( this._borderDivId ).style.display = "none";
		document.getElementById( this._closeLinkId ).style.display = "none";
	}
	
	// **************************************************************** 
	// * Transparent background controls
	// ****************************************************************
	this.disableBackground = function () {
		// summary: Disables the background by laying a transparent div over top of the document body.
		var div = document.getElementById( this._backgroundDivId );
		div.style.display = "block";
		this.sizeBackgroundDisablingDiv();
		this._htmlUtils.hideElementsByTagName( "select" );
	}
	
	this.sizeBackgroundDisablingDiv = function () {
		// summary: Sizes the transparent div appropriately.
		var div = document.getElementById( this._backgroundDivId );
		//dynamically size the div to the inner browser window
		this._htmlUtils.sizeToEntireArea( div );
	}
	
	this.enableBackground=function () {
		// summary: Enables the background by hiding the overlaid div.
		this._htmlUtils.showElementsByTagName( "select" );
		document.getElementById( this._backgroundDivId ).style.display = "none";
	}
};
