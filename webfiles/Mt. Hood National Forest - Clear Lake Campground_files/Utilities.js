var wptheme_DebugUtils = {
    // summary: Collection of utilities for logging debug messages.
    enabled: false, 
    log: function ( /*String*/className, /*String*/message ) {
            // summary: Logs a debugging message, if debugging is enabled.
            // className: the javascript class name or function name which is logging the message
            // message: the message to log
            if ( this.enabled ) {
                message = className + " ==> " + message;
                if ( typeof( console ) == "undefined" ) {
                        console.log( message );
                }
                else {
                        //better alternative for browsers that don't support console????
                        alert( message );
                }
            }    
    } 
}
var wptheme_HTMLElementUtils = {
	// summary: Collection of utility functions useful for manipulating HTML elements in a cross-browser fashion.
	className: "wptheme_HTMLElementUtils",
	_debugUtils: wptheme_DebugUtils,
    _uniqueIdCounter: 0,
	getUniqueId: function () {
		// summary: Generates a unique identifier (to the current page) by appending a counter to a set prefix.
		//		A page refresh resets the unique identifier counter.
		// returns: a unique identifier
		var retVal = "wptheme_unique_" + this._uniqueIdCounter;
		this._uniqueIdCounter++;
		return retVal;	// String
	},
	sizeToViewableArea: function ( /*HTMLElement*/element ) {
		// summary: Sizes the given element to the viewable area of the browser in a cross-browser fashion.
		// element: the html element to size
		var browserDimensions = new BrowserDimensions();
		element.style.height = browserDimensions.getViewableAreaHeight() + "px";
		element.style.width = browserDimensions.getViewableAreaWidth() + "px";
		element.style.top = browserDimensions.getScrollFromTop() + "px";
		element.style.left = browserDimensions.getScrollFromLeft() + "px";
	},
	sizeToEntireArea: function ( /*HTMLElement*/element ) {
		// summary: Sizes the given element to the viewable area plus the scroll area.
		// element: the html element to size
		var browserDimensions = new BrowserDimensions();
		//The getHTMLElement*() functions return the exact size of the body element in IE even if the viewable area is
		//larger (i.e. no scroll bars). In Firefox, the dimensions of the viewable area plus the scrollable area is returned.
		//So in IE, we take the viewable area if that is larger and the HTMLElement* area if that is larger.
		element.style.height = Math.max( browserDimensions.getHTMLElementHeight(), browserDimensions.getViewableAreaHeight() ) + "px";
		element.style.width = Math.max( browserDimensions.getHTMLElementWidth(), browserDimensions.getViewableAreaWidth() ) + "px";
	},
	sizeRelativeToViewableArea: function ( /*HTMLElement*/element, /*float*/heightFactor, /*float*/widthFactor ) {
		// summary: Sizes the given element to a certain multiple of the viewable area. For example, if heightFactor is 0.5,
		//		the height of the given element will be set to half of the viewable area height.
		// element: the html element to size
		// heightFactor: the factor to multiply the viewable area height by
		// widthFactor: the factor to multiply the viewable area width by
		var browserDimensions = new BrowserDimensions();
		element.style.height = ( browserDimensions.getViewableAreaHeight() * heightFactor ) + "px";
		element.style.width = ( browserDimensions.getViewableAreaWidth() * widthFactor ) + "px";
	},
	positionRelativeToViewableArea: function ( /*HTMLElement*/element, /*float*/heightFactor, /*float*/widthFactor ) {
		// summary: Positions the given element relative to the viewable area. For example, if the heightFactor is 0.5, the
		// 		top of the element will be positioned (Y axis) halfway down the viewable area. Note that this means the element
		//		will be ABSOLUTELY positioned.
		// element: the html element to position
		// heightFactor: the factor to multiply the viewable area height by
		// widthFactor: the factor to multiply the viewable area width by
		var browserDimensions = new BrowserDimensions();
		element.style.position = "absolute";
		if ( this._debugUtils.enabled ) { 
			this._debugUtils.log( this.className, "Browser's viewable height: " + browserDimensions.getViewableAreaHeight() );
			this._debugUtils.log( this.className, "Browser's viewable width: " + browserDimensions.getViewableAreaWidth() );
			this._debugUtils.log( this.className, "Browser's scroll from top: " + browserDimensions.getScrollFromTop() ); 
			this._debugUtils.log( this.className, "Browser's scroll from left: " + browserDimensions.getScrollFromLeft() );
		}
		element.style.top = ( ( browserDimensions.getViewableAreaHeight() * heightFactor ) + browserDimensions.getScrollFromTop() ) + "px";
		//Scroll left behaves differently in FF & IE in RTL languages. The "correct" behavior is up for debate. In FF, it will return the "correct" value 
		//(scrollLeft switches when the page is rendered right-to-left). In IE, scroll left will basically return the scroll width for the body element.
		//There's no real "capability" to test for here so the window.attachEvent is a cheap trick to check for IE.
		//bidiSupport is defined in the theme.
		if ( bidiSupport.isRTL && window.attachEvent ) {
			if ( this._debugUtils.enabled ) {
				this._debugUtils.log( this.className, "scrollWidth = " + browserDimensions.getHTMLElementWidth() );
				this._debugUtils.log( this.className, "clientWidth = " + browserDimensions.getViewableAreaWidth() );
				this._debugUtils.log( this.className, "Scroll Offset should be: " + ( browserDimensions.getHTMLElementWidth() - browserDimensions.getViewableAreaWidth() - browserDimensions.getScrollFromLeft() ) );
			}
			element.style.left = ( ( browserDimensions.getViewableAreaWidth() * widthFactor) + ( browserDimensions.getHTMLElementWidth() - browserDimensions.getViewableAreaWidth() - browserDimensions.getScrollFromLeft() ) ) + "px";
		}
		else {
			element.style.left = ( ( browserDimensions.getViewableAreaWidth() * widthFactor ) + browserDimensions.getScrollFromLeft() ) + "px";
		}	
	},
	positionOutsideElementTopRight: function ( /*HTMLElement*/elementToPosition, /*HTMLElement*/relativeElement ) {
		// summary: Positions the given element just outside (to the top and lining up with the right edge) of the
		//		relative element.
		// description: Sets the top (Y-axis) position of the given element to the top of the relative element minus the
		//		height of element being positioned. Sets the left (X-axis) position of the given element to the left position of
		//		the relative element plus the width of the relative element (to get the right edge) minus the width of the element 
		// 		being positioned (to line the end of the element being positioned up with the right edge of the relative element). 
		elementToPosition.style.position = "absolute";
		elementToPosition.style.top = ( this.stripUnits( relativeElement.style.top ) - elementToPosition.offsetHeight ) + "px";
		if ( bidiSupport.isRTL ) {
			elementToPosition.style.left = ( this.stripUnits( relativeElement.style.left ) ) + "px";
		}
		else {
			elementToPosition.style.left = ( this.stripUnits( relativeElement.style.left ) + relativeElement.offsetWidth - elementToPosition.offsetWidth) + "px";	
		}
	},
	stripUnits: function ( /*String*/cssProp ) {
		// summary: Strips any units (i.e. "px") from a CSS style property.
		// returns: the number value minus any units
		return parseInt( cssProp.substring( 0, cssProp.length - 2 ));	//integer
	},
	addClassName: function ( /*HTMLElement*/element, /*String*/className ) {
		// summary: Adds the given className to the element's style definitions.
		// element: the HTMLElement to add the class name to
		// className: the className to add
		var clazz = element.className;
		if ( clazz.indexOf( className ) < 0 ) {
			element.className += (" " + className);
		}	
	},
	removeClassName: function ( /*HTMLElement*/element, /*String*/className ) {
		// summary: Removes the given className from the element's style definitions.
		// element: the HTMLElement to remove the class name from
		// className: the className to remove
		var clazz = element.className;
		var startIndex = clazz.indexOf( className );
		if ( startIndex >= 0 ) {
			clazz = clazz.substring(0, startIndex) + clazz.substring( startIndex + className.length + 1 );
			element.className = clazz;
		}
	},
	hideElementsByTagName: function ( /*String 1...N*/) {
		// summary: Hides every element of a given tag name. Stores the old visibility style so it can be 
		//		restored by the showElementsByTagName function.
		for ( var i = 0; i < arguments.length; i++ ) {
			var elements = document.getElementsByTagName( arguments[i] );
			for ( var j = 0; j < elements.length; j++ ) {
				if ( elements[j] && elements[j].style ) {
					elements[j]._oldVisibilityStyle = elements[j].style.visibility;
					elements[j].style.visibility = "hidden";
				}
			}
		}
	},
	showElementsByTagName: function ( /*String 1...N*/) {
		// summary: Shows every element of a given tag name. Uses the old visibility style so that elements hidden
		//		by hideElementsByTagName are properly restored.
		for ( var i = 0; i < arguments.length; i++ ) {
			var elements = document.getElementsByTagName( arguments[i] );
			for ( var j = 0; j < elements.length; j++ ) {
				if ( elements[j] && elements[j].style ) {
					if ( elements[j]._oldVisibility ) {
						elements[j].style.visibility = elements[j]._oldVisibility;
						elements[j]._oldVisibility = null;
					}
					else {
						elements[j].style.visibility = "visible";
					}
				}
			}
		}	
	},
	addOnload: function ( /*Function*/func ) {
		// summary: Adds a function to be called on page load.
		// func: the function to call 
		if ( window.addEventListener ) {
			window.addEventListener( "load", func, false );
		}
		else if ( window.attachEvent ) {
			window.attachEvent( "onload", func );
		}
	},
	getEventObject: function ( /*Event?*/event ) {
		// summary: Cross-browser function to retrieve the event object.
		// event: In W3C-compliant browsers, this object will just simply be
		//		returned
		// returns: the event object
		var result = event;
		if ( !event && window.event ) {
			result = window.event;
		}
		return result;	// Event
	}
}

var wptheme_CookieUtils = {
	// summary: Various utility functions for dealing with cookies on the client.
	_deleteDate: new Date( "1/1/2003" ),
	_undefinedOrNull: function ( /*Object*/variable ) {
            // summary: Determines if a given variable is undefined or NULL.
            // returns: true if undefined OR NULL, false otherwise.
            return ( typeof ( variable ) == "undefined" || variable == null );  // boolean
	},
	debug: wptheme_DebugUtils,
        className: "wptheme_CookieUtils",
	getCookie: function ( /*String*/cookieName ) {
		// summary: Gets the value for a given cookie name. If no value is found, returns NULL.
		cookieName = cookieName + "="
		var retVal = null;
		if ( document.cookie.indexOf( cookieName ) >= 0 )
		{
		    var cookies = document.cookie.split(";");
		
		    var c = 0;
		    while ( c < cookies.length && ( cookies[c].indexOf( cookieName ) == -1 ) )
		    {
		        c=c+1;
		    }
			//Add one to the cookie length to account for the equals we added to the cookie name at the beginning of 
			//the function.
		    var cookieValue = cookies[c].substring( (cookieName.length + 1), cookies[c].length );
		    
		    if ( cookieValue != "null" )
		    {
		        retVal = cookieValue;
		    }
		}
		
		return retVal; // String
	},
	setCookie: function ( /*String*/name, /*String*/value, /*Date?*/expiration, /*String?*/path ) {
		// summary: Creates the cookie based on the given information.
		// name: the name of the cookie
		// value: the value for the cookie
		// expiration: OPTIONAL -- when the cookie should expire
		// path: OPTIONAL -- the url path the cookie applies to
		if ( this.debug.enabled ) { this.debug.log( this.className, "set cookie (" + [ name, value, expiration, path ]  + ")"); }
		
		if ( this._undefinedOrNull( name ) ) { throw Error( "Unable to set cookie! No name given!" ); }
		if ( this._undefinedOrNull( value ) ) { throw Error( "Unable to set cookie! No value given!" ); }
		if ( this._undefinedOrNull( expiration ) ) { 
			expiration = ""; 
		}
		else {
			expiration = "expiration=" + expiration.toUTCString() + ";";
		}
		if ( this._undefinedOrNull( path ) ) { 
			path = "path=/;"; 
		}
		else {
			path = "path=" + path + ";";
		}
		
		document.cookie=name + '=' + value + ';' + expiration +  path;		
	},
	deleteCookie: function ( /*String*/cookieName ) {
		// summary: Deletes a given cookie by setting the value to "null" and setting the expiration
		//		value to expire completely.
		if ( this.debug.enabled ) { this.debug.log( this.className, "delete cookie (" + [ cookieName ] + ") "); }
		this.setCookie( cookieName, "null", this._deleteDate );
	}
}