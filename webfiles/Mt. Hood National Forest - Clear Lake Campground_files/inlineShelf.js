var wpsInlineShelf_initShelfExpanded = wpsInlineShelf_getInitialShelfState();

// Current state of the flyout for the life of the request (true=expanded, false=collapsed)
var wpsInlineShelf_stateExpanded = false;

var wpsInlineShelf_currIndex = -1;

var wpsInlineShelf_loadingMsg = null;

function wpsInlineShelf_markupLoop( shelves )
{	
 	for(arrayIndex = 0; arrayIndex < shelves.length; arrayIndex++){
		if(shelves[arrayIndex].url != "" && shelves[arrayIndex].url != null){
			document.write('<li><a id="globalActionLinkInlineShelf'+arrayIndex+'" href="javascript:void(0);" onclick="wpsInlineShelf_toggleShelf('+arrayIndex+'); return false;" >');
			document.write(shelves[arrayIndex].altText+" ");
            document.write('<img src="'+shelves[arrayIndex].icon+'" id="toolBarIcon'+arrayIndex+'" title="'+shelves[arrayIndex].altText+'" border="0" alt="'+shelves[arrayIndex].altText+'" onmouseover="this.src=wptheme_InlineShelves['+arrayIndex+'].hoverIcon;" onmouseout="if (wptheme_InlineShelves['+arrayIndex+'].active) {this.src=wptheme_InlineShelves['+arrayIndex+'].activeIcon;} else this.src=wptheme_InlineShelves['+arrayIndex+'].icon;" />');            
			document.write('</a></li>');
		}
		
		if ( javascriptEventController )
		{
			javascriptEventController.register( "globalActionLinkInlineShelf" + arrayIndex );
		}
	}
}

// -----------------------------------------------------------------
// Called to toggle the shelf. This is the method that the function
// external to the shelf should call.
// -----------------------------------------------------------------
function wpsInlineShelf_toggleShelf(index, skipZoom)
{
	if(wptheme_InlineShelves[index] != null) {
    	var checkIndex = index;
    	var prevIndex=wpsInlineShelf_getCurrIndex();
        var newIframeUrl = null;

    	if(checkIndex==prevIndex){
            
    		if(wptheme_InlineShelves[index].active==true){
    			wptheme_InlineShelves[index].active=false;
                /*
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).src = wptheme_InlineShelves[prevIndex].icon;	
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).alt = wptheme_InlineShelves[prevIndex].altText;
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).title = wptheme_InlineShelves[prevIndex].altText;
    			*/
                wpsInlineShelf_stateExpanded = false;
    		}else{
    			wptheme_InlineShelves[index].active=true;
                /*
    			document.getElementById("globalActionLinkInlineShelf"+index).src = wptheme_InlineShelves[index].activeIcon;
    			document.getElementById("globalActionLinkInlineShelf"+index).alt = wptheme_InlineShelves[index].activeAltText;
    			document.getElementById("globalActionLinkInlineShelf"+index).title = wptheme_InlineShelves[index].activeAltText;
    			*/
                wpsInlineShelf_stateExpanded = true;
    		}
    	}else{
    		if(prevIndex > -1){
    			wptheme_InlineShelves[prevIndex].active=false;
                /*
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).src = wptheme_InlineShelves[prevIndex].icon;	
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).alt = wptheme_InlineShelves[prevIndex].altText;
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).title = wptheme_InlineShelves[prevIndex].altText;
    			*/
    		}
    		
    		wptheme_InlineShelves[index].active=true;
            /*
    		document.getElementById("globalActionLinkInlineShelf"+index).src = wptheme_InlineShelves[index].activeIcon;
    		document.getElementById("globalActionLinkInlineShelf"+index).alt = wptheme_InlineShelves[index].activeAltText;
    		document.getElementById("globalActionLinkInlineShelf"+index).title = wptheme_InlineShelves[index].activeAltText;
    		*/
    		wpsInlineShelf_setCurrIndex(index);
            wpsInlineShelf_stateExpanded = true;

            newIframeUrl = wptheme_InlineShelves[index].url;
//    		document.getElementById("wpsInlineShelf_shelfIFrame").src = wptheme_InlineShelves[index].url;
    	}
    	
    	if(wpsInlineShelf_stateExpanded){
            //Expanding flyout, store the open shelf index in the state cookie.
            wpsInlineShelf_setStateCookie( index );
            wpsInlineShelf_expandShelf( skipZoom, newIframeUrl );
		} else {
            //Closing shelf, clear the state cookie.
            wpsInlineShelf_clearStateCookie();
            wpsInlineShelf_collapseShelf();
        }
	}
}


function wpsInlineShelf_getCurrIndex()
{
	return wpsInlineShelf_currIndex;
}

function wpsInlineShelf_setCurrIndex(index)
{
	wpsInlineShelf_currIndex = index;
}

// -----------------------------------------------------------------
// Create a cookie to track the state of the shelf. The value of the 
// cookie is the index of the open shelf. The cookie is marked for 
// deletion when the browser closes and the path is set to ensure the 
// cookie is valid for the entire site.
// -----------------------------------------------------------------
function wpsInlineShelf_setStateCookie( index )
{
    document.cookie='portalOpenInlineShelf=' + index + '; path=/;';
}

// -----------------------------------------------------------------
// Clear the cookie by changing the value to null. By setting the expiration date in 
// the past, the cookie is marked for deletion when the browser closes.
// -----------------------------------------------------------------
function wpsInlineShelf_clearStateCookie()
{
    document.cookie='portalOpenInlineShelf=null; expires=Wed, 1 Jan 2003 11:11:11 UTC; path=/;';
}

// -----------------------------------------------------------------
// Determine if the shelf should initially open and which shelf 
// should be loaded. 
// -----------------------------------------------------------------
function wpsInlineShelf_getInitialShelfState()
{
	// Determine if the shelf's initial state is expanded or collapsed.
	if ( document.cookie.indexOf( "portalOpenInlineShelf=" ) >= 0 )
	{
	    var cookies = document.cookie.split(";");
	
	    var c = 0;
	    while ( c < cookies.length && ( cookies[c].indexOf( "portalOpenInlineShelf=" ) == -1 ) )
	    {
	        c=c+1;
	    }
	
	    initCookieValue = cookies[c].substring( ("portalOpenInlineShelf=".length)+1, cookies[c].length );
	    
	    if ( initCookieValue != "null" )
	    {
	        return initCookieValue;
	    }
	    else
	    {
	        return null;
	    }
	}
	else
	{
		return null;
	}
	
}


// -----------------------------------------------------------------
// Expand the shelf. The parameter skipZoom indicates whether or not
// the shelf should simply be rendered without the zoom-out effect.
// NOTE: The zoom-out effect is not implemented yet.
// ----------------------------------------------------------------- 
function wpsInlineShelf_expandShelf( skipZoom, newIframeUrl )
{
    var shelf = document.getElementById("wpsInlineShelf");
    
    wpsInlineShelf_stateExpanded = false;

    // attach event listeners so when the URL loads or reloads, the iframe will be shown and resized.
    wpsInlineShelf_AttachIframeEventListeners("wpsInlineShelf_shelfIFrame");

    // show the shelf... but not the iframe yet...
    shelf.style.display = "block";

    // We change the URL AFTER the event listeners are hooked up.
    // If we are not changing the URL, we need to manually resize the iframe.
    if (null != newIframeUrl) {
        // when loading a new URL, display the spinning loading graphic
        wpsInlineShelf_loadingMsg.show(document.getElementById("wpsInlineShelf"));
        document.getElementById("wpsInlineShelf_shelfIFrame").src = newIframeUrl;
    } else {
        wpsInlineShelf_resizeIframe("wpsInlineShelf_shelfIFrame");
    }

}


// -----------------------------------------------------------------
// Collapse the shelf. The parameter skipZoom indicates whether or not
// the shelf should simply be rendered without the zoom-in effect.
// NOTE: The zoom-in effect is not implemented yet yet.
// ----------------------------------------------------------------- 
function wpsInlineShelf_collapseShelf( skipZoom )
{
    var shelf = document.getElementById("wpsInlineShelf");
    var iframe = document.getElementById("wpsInlineShelf_shelfIFrame");

    shelf.style.display = "none";
    iframe.style.display = "none";
    wpsInlineShelf_loadingMsg.hide();
    wpsInlineShelf_stateExpanded = true;
}

// -----------------------------------------------------------------
// Check which side of the page the shelf should show on
// -----------------------------------------------------------------
function wpsInlineShelf_onloadShow( isRTL )
{
    if ( wpsInlineShelf_initShelfExpanded != null )
    {
        wpsInlineShelf_toggleShelf( wpsInlineShelf_initShelfExpanded, true );
    }   
}


var wpsInlineShelf_getFFVersion=navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox")).split("/")[1]
var wpsInlineShelf_FFextraHeight=parseFloat(wpsInlineShelf_getFFVersion)>=0.1? 16 : 0 //extra height in px to add to iframe in FireFox 1.0+ browsers

function wpsInlineShelf_resizeIframe(iframeID){
    var iframe=document.getElementById(iframeID)

    iframe.style.display = "block";
    wpsInlineShelf_loadingMsg.hide();

    if (iframe && !window.opera) {

/*
		// put the background color style onto the body of the document in the iframe
		if (iframe.contentDocument) {
			var iframeDocBody = iframe.contentDocument.body;
			if (iframeDocBody.className.indexOf("wpsInlineShelfIframeDocBody",0) == -1) {
				iframeDocBody.className = iframeDocBody.className + " wpsInlineShelfIframeDocBody";
			}
		}
*/
        if (iframe.contentDocument && iframe.contentDocument.body.offsetHeight) //ns6 syntax
            iframe.height = iframe.contentDocument.body.offsetHeight+wpsInlineShelf_FFextraHeight;
        else if (iframe.Document && iframe.Document.body.scrollHeight) //ie5+ syntax
            iframe.height = iframe.Document.body.scrollHeight;
    }
}

function wpsInlineShelf_AttachIframeEventListeners(iframeID) {
    var iframe=document.getElementById(iframeID)
    if (iframe && !window.opera) {

        if (iframe.addEventListener){
            iframe.addEventListener("load", wpsInlineShelf_IframeOnloadEventListener, false)
        } else if (iframe.attachEvent){
            iframe.detachEvent("onload", wpsInlineShelf_IframeOnloadEventListener) // Bug fix line
            iframe.attachEvent("onload", wpsInlineShelf_IframeOnloadEventListener)
        }
    }
}

function wpsInlineShelf_IframeOnloadEventListener(loadevt) {
    var crossevt=(window.event)? event : loadevt
    var iframeroot=(crossevt.currentTarget)? crossevt.currentTarget : crossevt.srcElement
    if (iframeroot) {
        wpsInlineShelf_resizeIframe(iframeroot.id);
    }
}

// -----------------------------------------------------------------
// If we have an empty expanded shelf (via the back button), load 
// the previously open shelf.
// -----------------------------------------------------------------
function wpsInlineShelf_checkForEmptyExpandedShelf() {
	var index = wpsInlineShelf_getInitialShelfState();
    
	if ( index != null && wptheme_InlineShelves[index] != null)
	{
		document.getElementById("wpsInlineShelf_shelfIFrame").src = wptheme_InlineShelves[index].url;
	}
}

wptheme_QuickLinksShelf = {
	_cookieUtils: wptheme_CookieUtils,
	cookieName: null,
	expand: function () {
		// summary: Expand the quick links shelf.
		document.getElementById("wptheme-expandedQuickLinksShelf").style.display='block';
        document.getElementById("wptheme-collapsedQuickLinksShelf").style.display='none';
        if ( this.cookieName != null ) {
        	this._cookieUtils.deleteCookie( this.cookieName );
        }	
        return false;
	},
	collapse: function () {
		// summary: Collapse the quick links shelf.
		document.getElementById("wptheme-expandedQuickLinksShelf").style.display='none';
        document.getElementById("wptheme-collapsedQuickLinksShelf").style.display='block';
        if ( this.cookieName != null ) {
        	var expires = new Date();
        	expires.setDate( expires.getDate() + 5 );
        	this._cookieUtils.setCookie( this.cookieName, "small", expires );
        }
        return false;
	}
}

var wpsInlineShelf_LoadingImage = function ( /*String*/cssClassName, /*String*/imageURL, /*String*/imageText ) {
    // summary: creates loading image for inline shelf
    // cssClassName: the class name to apply to the overlaid div
    // imageURL: the url to the image to display in the center of the overlaid div
    // imageText: the text to display next to the image    

    var elem = document.createElement( "DIV" );
    elem.className = cssClassName;
    elem.id = cssClassName;

    if ( imageURL && imageURL != "" && imageText ) {
        elem.innerHTML = "<img src='"+ imageURL + "' border=\"0\" alt=\"\" />&nbsp;" + imageText;
    }   
    
    var appended = false;
    
    this.show = function ( refNode ) { 
        if ( !appended ) {
            refNode.appendChild( elem );
            appended= true;
        }
        
        elem.style.display = 'block';
    }

    this.hide = function () {
        elem.style.display = 'none';
    }
}

/*        
        
        //Should script hide iframe from browsers that don't support this script (non IE5+/NS6+ browsers. Recommended):
        var iframehide="yes"

        var getFFVersion=navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox")).split("/")[1]
        var FFextraHeight=parseFloat(getFFVersion)>=0.1? 16 : 0 //extra height in px to add to iframe in FireFox 1.0+ browsers

        function resizeCaller() {
                if (document.getElementById)
                        resizeIframe("myiframe")

                //reveal iframe for lower end browsers? (see var above):
                if ((document.all || document.getElementById) && iframehide=="no"){
                        var tempobj=document.all? document.all["myiframe"] : document.getElementById("myiframe")
                        tempobj.style.display="block"
                }
        }
        function resizeIframe(frameid){
                var currentfr=document.getElementById(frameid)
                if (currentfr && !window.opera) {
                        currentfr.style.display="block"
                        if (currentfr.contentDocument && currentfr.contentDocument.body.offsetHeight) //ns6 syntax
                                currentfr.height = currentfr.contentDocument.body.offsetHeight+FFextraHeight;
                        else if (currentfr.Document && currentfr.Document.body.scrollHeight) //ie5+ syntax
                                currentfr.height = currentfr.Document.body.scrollHeight;

                        if (currentfr.addEventListener){
                                currentfr.addEventListener("load", readjustIframe, false)
                        }
                        else if (currentfr.attachEvent){
                currentfr.detachEvent("onload", readjustIframe) // Bug fix line
                currentfr.attachEvent("onload", readjustIframe)
            }
                }
        }

        function readjustIframe(loadevt) {
                var crossevt=(window.event)? event : loadevt
                var iframeroot=(crossevt.currentTarget)? crossevt.currentTarget : crossevt.srcElement
                if (iframeroot)
                resizeIframe(iframeroot.id);
        }

        function wptheme_ExpandToolsShelf() {
		//loadToolsIframe('myiframe', '${inlineTCUrl}');
                document.getElementById("wptheme-expandedToolsShelf").style.display='block';
	        document.getElementById("wptheme-collapsedToolsShelf").style.display='none';
		//document.getElementById("wptheme-expandedToolsShelfLink").style.display='block';
		//document.getElementById("wptheme-collapsedToolsShelfLink").style.display='none';
		document.getElementById("toolsShelfCollapseLink").style.display='block';
		document.getElementById("toolsShelfExpandLink").style.display='none';
		loadToolsIframe('myiframe', '${inlineTCUrl}');
                //if (document.getElementById)
                //      resizeIframe("myiframe");
                resizeCaller();
                wptheme_createCookie("<%=toolsShelfCookie%>",'small',7);
        return false;
    }

        function wptheme_CollapseToolsShelf() {
                document.getElementById("wptheme-expandedToolsShelf").style.display='none';
        	document.getElementById("wptheme-collapsedToolsShelf").style.display='block';
		//document.getElementById("wptheme-expandedToolsShelfLink").style.display='none';
                //document.getElementById("wptheme-collapsedToolsShelfLink").style.display='block';
		document.getElementById("toolsShelfCollapseLink").style.display='none';
                document.getElementById("toolsShelfExpandLink").style.display='block';
                wptheme_eraseCookie("<%=toolsShelfCookie%>");
        return false;
    }
	function loadToolsIframe(iframeName, toolsUrl){
		alert('loading tools iframe');
		if (document.getElementById) {
			document.getElementById(iframeName).src = toolsUrl;
		}
		return false;
    }
    
*/    
