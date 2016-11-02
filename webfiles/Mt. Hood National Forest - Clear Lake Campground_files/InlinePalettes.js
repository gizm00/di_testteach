var wptheme_InlinePalettes = {
    // summary: Manages the inline palette(s). Tracks the iframe used to display the palettes, as well as the persistent state.
    // description: Palettes managed by this object must be added using the addPalette method. The addPalette method expects a
    //      PaletteContext object which has the following structure:
    //      {
    //          url: the url to set the iframe to (for CSA, only used as the initial url)
    //          page: the unique id of the page the url will be pointing to
    //          portlet: the unique id of the portlet control the url will be pointing to
    //          newWindow: indicates whether or not the url should be rendered using the Plain theme template
    //          portletWindowState: the window state the portlet should be in
    //          selectionDependent: indicates whether or not the url changes based on the current page selection
    //      }
    //      This PaletteContext object is required to support client-side aggregation. Since, in client-side aggregation,
    //      the page does not always reload in between page changes, the palette may need to be refreshed as the selection
    //      changes in client-side aggregation. This context object gives the client-side aggregation engine all the info
    //      it needs to create the appropriate url for the palette, as needed.
    // paletteStatus: indicates whether the palette is open or closed (0 = closed, 1 = open)
    // iframeID: the ID/NAME of the iframe to use
    // loadingDecorator: the decoration to display while the iframe is loading
    // currentIndex: the index (into the paletteContextArray) of the currently displaying palette
    // cookieName: the cookie used to store the state of the palette
    // paletteContextArray: the array of PaletteContext objects
    // urlFactory: only used in client-side aggregation -- set during the CSA theme's bootstrap, this function takes the PaletteContext
    //      object described above as the only parameter and returns the url to use to display the palette
    
    // INITIALIZATION
    className: "wptheme_InlinePalettes",

    //HTML element IDs
    iframeID: "wpsFLY_flyoutIFrame",    
    
    //Persistent state of the palette
    paletteStatus: 0,  // 0 = closed, 1 = open
    currentIndex: -1,   // the index of the paletteContextArray which is currently displaying
    cookieName: "portalOpenFlyout", 
    
    //Decoration to display while the palette is loading
    loadingDecorator: null, //needs to provide 2 functions: show and hide. show will receive a single parameter -- the node which should be covered with the decoration
    
    //Instance variables
    urlFactory: null,   //expected to be set in the bootstrap of the CSA theme. takes the context as a single parameter and returns the url as the output.
    paletteContextArray: [],    // Array of palettes which can be displayed
    
    //Debug
    debug: wptheme_DebugUtils,
    
    init: function ( /*Document?*/doc) {
        // summary: Initializes the inline palettes. Usually executed on page load.
        // description: Checks to see if the persisted state indicates the palette should be open or closed. If open, the proper location
        //      should be loaded into the iframe and displayed.
        // doc: OPTIONAL -- specifies the document to use when initializing (for use when called from within an iframe, for example).
        if ( this.debug.enabled ) { this.debug.log( this.className, "init( " + [ doc ] + ")" ); }
        
        if ( !doc ) { doc = document; }
        
        //Retrieve the persisted value. This will be the index into the PaletteContextArray.
        var value = this.getPersistedValue();
        if ( this.debug.enabled ) { this.debug.log( this.className, "retrieved value: " + value ); }
        if ( value != null && this.paletteContextArray[ value ] ) {
            this.show( value, true );
        } else {
            this.hide();
        }
        
        if ( this.debug.enabled ) { this.debug.log( this.className, "return init" ); }
    },
    
    // DISPLAY CONTROL 
    
    showCurrent: function () {
        // summary: Displays the current index or auto selects an index if no current index is selected.
        var indexToShow = 0;
        if ( this.currentIndex > -1 ) {
            indexToShow = this.currentIndex;
        }
        
        this.show( indexToShow );
    },
    
    show: function (/*int*/index, /*boolean?*/skipAnimation) {
        // summary: Displays the specified url in the palette.
        // url: the url for the iframe.
        // skipAnimation: OPTIONAL -- skips the loading decorator show/hide steps (used for the case where the palette is open on an initial page load
        if ( this.debug.enabled ) { this.debug.log( this.className, "show( " + [ index, skipAnimation ] + ")" ); }
        
        var iframe = this._getIframeElement();
        if ( !iframe ) { return false; }
        
        var url = this.getURL( index );
        
        iframe.parentNode.style.display = "block";
        //If we have to load the iframe, call postShow onload. Otherwise, call it immediately since the
        //iframe is already loaded.
        if ( window.frames[this.iframeID].location.href != url ) {
            if ( !skipAnimation && this.loadingDecorator != null && this.loadingDecorator.show ) {
                this.loadingDecorator.show( iframe.parentNode.parentNode );
            }
            iframe.src = url;
        }
        else {
            //The location hasn't changed so go ahead and call the post show behavior. Normally, the post show 
            //behavior executes once the iframe is loaded. 
            this._doPostShow();
        }
        
        this.persist( index );
        this.paletteStatus = 1;
        this.currentIndex = index;
    },
    hide: function ( doc ) {
        // summary: Hides the active palette.
        if ( this.debug.enabled ) { this.debug.log( this.className, "hide( " + [ doc ] + ")" ); }
        var iframe = this._getIframeElement( doc );
        if ( !iframe ) { return false; }
        
        iframe.parentNode.style.display = "none";
        this.paletteStatus = 0;
        this.currentIndex = -1;
        
        //Execute the post hide behavior.
        this._doPostHide();
    },
    _doPostShow: function () {
        // summary: Called after the iframe is loaded and ready to display.
        // description: Performs any sizing adjustments necessary (possibly IE) and hides the loading decoration.
        if ( this.debug.enabled ) { this.debug.log( this.className, "_doPostShow()" ); }
        var iframe = this._getIframeElement();
        if ( iframe.parentNode.style.display == "none" ) { return false; }
        iframe.style.visibility = "visible";
        
        if ( typeof ( dojo ) != "undefined" ) {
            var size = dojo.contentBox( iframe );
            if ( size.h < 300) {
                //IE doesn't correctly size the iframe when height is set to 100%. So if the height
                //is still 0 (IE 6) or small (IE7)after setting the display and visibility, set it manually to the height
                //of the TD element.
                var size = dojo.contentBox( iframe.parentNode.parentNode );
                iframe.style.height = size.h + "px";
            }
        }   
        
        if ( this.loadingDecorator != null && this.loadingDecorator.hide ) {
            this.loadingDecorator.hide();
        }
    },
    _doPostHide: function () {
        // summary: Execute any actions that need to occur after the palette is hidden from view.
        if ( this.debug.enabled ) { this.debug.log( this.className, "_doPostHide()" ); }
        var iframe = this._getIframeElement();
        iframe.style.visibility = "hidden";
    },
    
    // PERSISTENT STATE CONTROL
    
    persist: function ( /*String*/value ) {
        // summary: Persist the given value in a cookie.
        if ( this.debug.enabled ) { this.debug.log( this.className, "persist(" + [ value ] + ")" ); }
        wptheme_CookieUtils.setCookie( this.cookieName, value );
    },
    getPersistedValue: function () {
        // summary: Retrieve the persisted state for the inline palettes, if one exists.
        // description: Looks for the "portalOpenFlyout" cookie and parses out it's value.
        // returns: the persisted value for the portalOpenFlyout cookie or NULL if no value exists.
        if ( this.debug.enabled ) { this.debug.log( this.className, "getPersistedValue()" ); }
        return wptheme_CookieUtils.getCookie( this.cookieName );
    },
    unpersist: function () {
        // summary: Clears out the persisted value.
        // description: Sets the cookie's value to NULL and sets it to expire in the past.
        // returns: the index of the persisted value
        if ( this.debug.enabled ) { this.debug.log( this.className, "unpersist()" ); }
        var value = this.getPersistedValue();
        wptheme_CookieUtils.deleteCookie( this.cookieName );
        return value;
    },
    
    // UTILITY
    
    _getIframeElement: function ( /*Document?*/doc ) {
        // summary: Retrieves the iframe HTML element from the HTML document specified. If no HTML document is specified,
        //      the global HTML document is used.
        // doc: OPTIONAL -- specify the HTML document in which to look up the IFRAME object.
        // returns: the iframe HTML element
        if ( this.debug.enabled ) { this.debug.log( this.className,  "_getIframeElement( " + [ doc ] + ")" ); }
        if ( !doc ) { doc = document; }
        return doc.getElementById( this.iframeID );     // the IFRAME HTML element
    },
    addPalette: function ( /*PaletteContext*/context ) {
        if ( this.debug.enabled ){ this.debug.log( this.className, "addPalette( " + [ context ] + ")" ); }
        this.paletteContextArray.push( context );
    },
    
    getURL: function ( /*int*/value ) {
        if ( this.debug.enabled ) { this.debug.log( this.className, "getURL( " + [ value ] + ")" ); }
        var url = this.paletteContextArray[ value ].url;
        if ( document.isCSA && this.urlFactory != null ) {
            url = this.urlFactory( this.paletteContextArray[ value ] );
        }
        return url;
    }
    
    
}

var wptheme_DarkTransparentLoadingDecorator = function ( /*String*/cssClassName, /*String*/imageURL, /*String*/imageText ) {
    // summary: Displays a partially opaque overlay with a centered image and text to partially obscure and prevent
    //      interaction with a loading portion of the HTML page.
    // cssClassName: the class name to apply to the overlaid div
    // imageURL: the url to the image to display in the center of the overlaid div
    // imageText: the text to display next to the image
    this.className = "wptheme_DarkTransparentLoadingDecorator";
    
    var elem = document.createElement( "DIV" );
    elem.className = cssClassName;
    elem.style.position = "absolute";
    
    if ( imageURL && imageURL != "" && imageText ) {
        var text = document.createElement( "DIV" );
        text.style.position = "relative";
        text.style.top = "50%";
        text.style.left = "40%";
        text.innerHTML = "<img src='"+ imageURL + "' />&nbsp;" + imageText;
        elem.appendChild( text );
    }   
    
    var appended = false;
    
    this.show = function ( refNode ) { 
        if ( !appended ) {
            document.body.appendChild( elem );
            appended= true;
        }
        
        elem.style.display = 'block';
        elem.style.top = (dojo.coords( refNode, true ).y + 1) + "px";
        elem.style.left = (dojo.coords( refNode, true ).x + 1)  + "px";
      
        var size = dojo.contentBox( refNode );
        elem.style.height = (size.h - 2) + "px";
        elem.style.width = (size.w - 2) + "px";
    }

    this.hide = function () {
        elem.style.display = 'none';
    }
}

var wptheme_InlinePalettesContainer = { 
    // summary: Manages the inline palettes container.
    // description: Manages the container which holds the palettes. Made up of two parts: the first is the container.
    //      The container holds the links to select a palette, as well as, the actual iframe which displays
    //      the palette once a palette is selected. The second is the toggle element. The toggle element is
    //      the html element which actually opens and closes the container element.
    // containerStatus: indicates whether the container is open or closed (0 = closed, 1 = open)
    // openCssClassName: indicates the CSS class name which should be applied when the container is open
    // closedCssClassName: indicates the CSS class name which should be applied when the container is closed
    // containerElementID: the id of the html element which actually holds the palettes
    // toggleElementID: the id of the html element which is the toggle element
    // lastIndex: the index of the last palette that was opened
    // cookieName: the name of the cookie used to store the container's last state
    // cookieUtils: the utility object used to set and unset cookies - default is wptheme_CookieUtils
    // htmlUtils: the utility object used for adding/removing css classnames - default is wptheme_HTMLElementUtils
    // paletteManager: the object which contains the information about the palettes to display inside the container
    //      default is wptheme_InlinePalettes
    className: "wptheme_InlinePalettesContainer",
    
    containerStatus: 0,     //0 = closed, 1 = open
    openCssClassName: "wptheme-flyoutExpanded",
    closedCssClassName: "wptheme-flyoutCollapsed",
    toggleElementID: "wptheme-flyoutToggle",
    containerElementID: "wptheme-flyout",
    lastIndex: null,
    cookieName: "portalFlyoutIsOpen",
    cookieUtils: wptheme_CookieUtils,
    htmlUtils: wptheme_HTMLElementUtils,
    paletteManager: wptheme_InlinePalettes,
    
    //Main functions.
    init: function ( /*HTMLDocument?*/doc ) {
        // summary: Initializes and sets the appropriate visibilites for the container and the
        //      palettes inside.
        // doc: OPTIONAL -- used when called from an iframe
        var cookie = this.cookieUtils.getCookie( this.cookieName );
        if ( cookie && cookie != "null" ) {
            this.containerStatus = parseInt( cookie );
        }
        
        if ( this.paletteManager.paletteContextArray.length == 0 ) {
            this.disable();
        }
        else {
            if ( this.containerStatus ) {
                this.paletteManager.init();
                this._show();
            }
            else {
                this._hide();
            }
            this._makeVisible();
        }
    },
    toggle: function () {
        // summary: Toggles the container between open and closed state.
        
        if ( this.containerStatus ) {
            this.containerStatus = 0;
            this._hide();           
        }   
        else {
            this.containerStatus = 1;
            this._show();
        }
    },
    persist: function () {
        // summary: Sets the cookie with the current container status.
        this.cookieUtils.setCookie( this.cookieName, this.containerStatus );
        if ( this.paletteManager.currentIndex == this.lastIndex ) {
            this.paletteManager.persist( this.lastIndex );
        }
    },
    unpersist: function () {
        // summary: Removes the cookie which holds the state of the flyout.
        this.cookieUtils.deleteCookie( this.cookieName );
        this.lastIndex = this.paletteManager.unpersist();
    },
    _makeVisible: function () {
        // summary: Shows the toggle element AND the container element.
        //Retrieve the applicable DOM elements.
        var toggleElement = document.getElementById( this.toggleElementID );
        toggleElement.style.visibility = 'visible';
    },
    disable: function () {
        // summary: Hides the toggle element AND the container element.
        //Retrieve the applicable DOM elements.
        var toggleElement = document.getElementById( this.toggleElementID );
        var containerElement = document.getElementById( this.containerElementID );
        

        if (toggleElement != null) {
            toggleElement.style.display = 'none';
        }
        if (containerElement != null) {
            containerElement.style.display = 'none';
        }
    },
    _hide: function () {
        //Retrieve the applicable DOM elements.
        var toggleElement = document.getElementById( this.toggleElementID );
        var containerElement = document.getElementById( this.containerElementID );
        
        if ( !toggleElement || !containerElement ) {
            throw Error( "Unable to retrieve the necessary markup elements! The palettes may not function correctly.");
        }
        
        //Closing the container.
        this.htmlUtils.removeClassName( toggleElement, this.openCssClassName );
        this.htmlUtils.addClassName( toggleElement, this.closedCssClassName );
        containerElement.style.display = 'none';
        
        //Persistence cleanup.
        this.unpersist();       
    },
    _show: function () {
        //Retrieve the applicable DOM elements.
        var toggleElement = document.getElementById( this.toggleElementID );
        var containerElement = document.getElementById( this.containerElementID );
        
        if ( !toggleElement || !containerElement ) {
            throw Error( "Unable to retrieve the necessary markup elements! The palettes may not function correctly.");
        }
        
        //Opening the container.
        this.htmlUtils.removeClassName( toggleElement, this.closedCssClassName );
        this.htmlUtils.addClassName( toggleElement, this.openCssClassName );
        containerElement.style.display = 'block';
        
        this.paletteManager.showCurrent();
        
        //Persistence cleanup.
        this.persist();
    }
}
//If we aren't inside an iframe, go ahead and register the init function so it's called on page load. This is where we check for 
//a palette's persistent state and handle other startup tasks.
if ( top.location == self.location ) {
    wptheme_InlinePalettesContainer.htmlUtils.addOnload( function () { wptheme_InlinePalettesContainer.init(); } );
};
