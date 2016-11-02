// Populates and shows a context menu asynchronously. 
//
// uniqueID             - some unique identifier describing the context of the menu (i.e. portlet window id)
// urlToMenuContents    - url target for the iFrame
// isLTR                - indicates if the page orientation is Left-to-Right
//
//
// This function creates a context menu using the WCL context menu javascript library. It populates this menu
// by creating a hidden DIV ( the ID consists of the unique identifier with "_DIV" appended ) which contains
// a hidden IFRAME ( the ID consists of the DIV identifier with "_IFRAME" appended ). The IFRAME loads the 
// specified URL and calls the buildAndDisplayMenu() function upon completion of loading the IFRAME. The document
// returned by the specified URL must contain a javascript function called "getMenuContents()" which returns 
// an array. The contents of the array must be in the following format ( array[i] = <menu-item-display-name>; 
// array[i+1] = <menu-item-action-url> ). The menu is attached to an HTML element with the id equal to the 
// unique identifier. So, in the portlet context menu case, the image associated with the context menu must have
// an ID equal to the portlet window ID. The dynamically created DIV and IFRAME are deleted after the menu 
// contents are populated and the same menu is returned for the duration of the request in which it was created.
//

//Control debugging. 
// -1 - no debugging
//  0 - minimal debugging ( adding items to menus )
//  1 - medium debugging ( function entry/exit )
//  2 - maximum debugging ( makes iframe visible )
// 999 - make iframe visible only
var asynchContextMenuDebug = -1;

var asynchContextMenuMouseOverIndicator = "";

var portletIdMap = new Object();

function asynchContextMenuOnMouseClickHandler( uniqueID, isLTR, urlToMenuContents, menuBorderStyle, menuTableStyle, menuItemStyle, menuItemSelectedStyle, emptyMenuText, loadingImage, renderBelow )
{
	var menuID = "contextMenu_" + uniqueID;
    
    var menu = getContextMenu( menuID );
    
    if (menu == null) 
    { 
    	asynchContextMenu_menuCurrentlyLoading = uniqueID;
    	
    	if ( loadingImage )
    	{
			setLoadingImage( loadingImage );
	    }

        menu = createContextMenu( menuID, isLTR, null, menuBorderStyle, menuTableStyle, emptyMenuText, null, renderBelow );
        loadAsynchContextMenu( uniqueID, urlToMenuContents, isLTR, menuItemStyle, menuItemSelectedStyle, '', true );
    }
    else
    {
    	if ( asynchContextMenu_menuCurrentlyLoading == uniqueID )
		{
			return;	
		}
    	showContextMenu( menuID, document.getElementById( uniqueID ) );
    }	
}

var asynchContextMenu_originalMenuImgElementSrc;

function setLoadingImage( img )
{
	asynchContextMenu_originalMenuImgElementSrc = document.getElementById( asynchContextMenu_menuCurrentlyLoading + "_img" ).src;
	document.getElementById( asynchContextMenu_menuCurrentlyLoading + "_img" ).src = img;
}

function clearLoadingImage()
{
	document.getElementById( asynchContextMenu_menuCurrentlyLoading + "_img" ).src = asynchContextMenu_originalMenuImgElementSrc;
}

function loadAsynchContextMenu( uniqueID, url, isLTR, menuItemStyle, menuItemSelectedStyle, emptyMenuText, showMenu, onMenuAffordanceShowHandler )
{
    asynchDebug( 'ENTRY loadAsynchContextMenu p1=' + uniqueID + '; p2=' + url + '; p3=' + isLTR + '; p4=' + isLTR);
	
	var menuID = "contextMenu_" + uniqueID;

    var dialogTag = null;
    var ID = uniqueID + '_DIV';
			
	//an iframe wasn't cleaned up properly
	if ( document.getElementById( ID ) != null )
	{
		closeMenu( ID );
        return;
	}
	
	//create the div tag and assign the styles to it		
	dialogTag = document.createElement( "DIV" );
	dialogTag.style.position="absolute";
	
	if ( asynchContextMenuDebug < 2 )
	{
		dialogTag.style.left = "0px";
		dialogTag.style.top  = "-100px";
    	dialogTag.style.visibility = "hidden";
	}
	
	if ( asynchContextMenuDebug >= 2 || asynchContextMenuDebug == 999 )
	{
		dialogTag.style.left = "100px";
		dialogTag.style.top  = "100px";
    	dialogTag.style.visibility = "visible";
	}		
	
	dialogTag.id=ID;
	
	var styleString = 'null';
	
	if ( menuItemStyle != null )
	{
		styleString = "'" + menuItemStyle + "'";
	}
	
	if ( menuItemSelectedStyle != null ) 
	{
		styleString = styleString + ", '" + menuItemSelectedStyle + "'";
	}
	else
	{
		styleString = styleString + ", null";
	}
	
	//alert( 'buildAndDisplayMenu( this.id, this.name, ' + styleString + ', ' + showMenu + ' , ' + callbackFn + ' );' );
	
    //create the iframe this way because onload handlers attached when creating dynamically don't seem to fire
    dialogTag.innerHTML='<iframe id="' + menuID + '" name="' + ID + '_IFRAME" src="' + url + '" onload="buildAndDisplayMenu( this.id, this.name, ' + styleString + ', ' + showMenu + ' , \''+ onMenuAffordanceShowHandler + '\' ); return false;" ></iframe>';
		
	//append the div tag to the document body		
	document.body.appendChild( dialogTag );

    asynchDebug( 'EXIT createDynamicElements' );

}



//Builds and displays the menu from the contents of the IFRAME.
function buildAndDisplayMenu( menuID, iframeID, menuItemStyle, menuItemSelectedStyle, showMenu, onMenuAffordanceShowHandler )
{
    asynchDebug( 'ENTRY buildAndDisplayMenu p1=' + menuID + '; p2=' + iframeID + '; p3=' + showMenu + '; p4=' + onMenuAffordanceShowHandler );
    
    //get the context menu, should have already been created.
    var menu = getContextMenu( menuID );

	//clear out our loading indicator
    clearLoadingImage();
   	asynchContextMenu_menuCurrentlyLoading = null;

    //if the menu doesn't exist, we shouldn't even be here....but just in case.
    if ( menu == null )
    {
        return false;
    }

    //strip the _IFRAME from the id to come up with the DIV id
    index = iframeID.indexOf( "_IFRAME" );
    var divID = iframeID.substring( 0, index );

    //strip the _DIV from the id to come up with the portlet id
    index2 = divID.indexOf( "_DIV" );
    var uniqueID = divID.substring( 0, index2 );
    
    asynchDebug( 'divID = ' + divID );
    asynchDebug( 'uniqueID = ' + uniqueID );

    var frame, c=-1, done=false;

    //In IE, referencing the iFrame via the name in the window.frames[] array
    //does not appear to work in this case, so we have to cycle through all the 
    //frames and compare the names to find the correct one.
    while ( ( c + 1 ) < window.frames.length && !done )
    {  
        c=c+1;

		//We have to surround this with a try/catch block because there are
		//cases where attempting to access the 'name' property of the current
		//frame in the array will generate an access denied exception. This is 
		//OK to ignore because any frame that generates this exception shouldn't
		//be the one we are looking for.
        try 
        {
            done = ( window.frames[c].name == iframeID );
        }
        catch ( e )
        {
            //do nothing.
        }
    }

    //Check for the existence of the function we are looking to call. 
    //If not, don't bother creating the menu. 
    if ( window.frames[c].getMenuContents )
    {
        contents = window.frames[c].getMenuContents();
    }
    else
    {
        //we were unable to load the context menu for whatever reason
        return false;
    }
    
    
    //Cycle through the array created by the getMenuContents()
    //function. The structure of the array should be [url, name].
    for ( i=0; i < contents.length; i=i+3 ) 
    {
        asynchDebug2( 'Adding item: ' + contents[i+1] );
        asynchDebug2( 'URL: ' + contents[i] );
        if ( contents[i] )
        {
        	asynchDebug2( 'url length: ' + contents[i].length );
        }
        asynchDebug2( 'icon: ' + contents[i+2] );

        if ( contents[i] && contents[i].length != 0 )
        {
        	var icon = null;
        	
        	if ( contents[i+2] && contents[i+2].length != 0 )
        	{
        		icon = contents[i+2];
        	}
        
            menu.add( new UilMenuItem( contents[i+1], true, '', contents[i], null, icon, null, menuItemStyle, menuItemSelectedStyle ) );
        }
    }

    //our target image should have an ID of the uniqueID
    var target = document.getElementById( uniqueID );
    //remove our iframe since we've created the menu, we don't need the iframe on this request anymore.
    // (148004) deleting the elements causes the status bar to spin forever on mozilla
    //deleteDynamicElements( divID );

    asynchDebug( 'EXIT buildAndDisplayMenu' );

	//asynchContextMenuOnLoadCheck( menuID, uniqueID, target, onMenuAffordanceShowHandler );

    //...and display!
    if ( showMenu == null || showMenu == true )
    {
    	return showContextMenu( menuID, target ); 
    }
}


//Creates and loads the IFRAME.
function createDynamicElements( uniqueID, url, menuID, menuItemStyle, menuItemSelectedStyle )
{
    asynchDebug( 'ENTRY createDynamicElements p1=' + uniqueID + '; p2=' + url + '; p3=' + menuID );

    var dialogTag = null;
    var ID = uniqueID + '_DIV';
			
	//an iframe wasn't cleaned up properly
	if ( document.getElementById( ID ) != null )
	{
		closeMenu( ID );
        return;
	}
	
	//create the div tag and assign the styles to it		
	dialogTag = document.createElement( "DIV" );
	dialogTag.style.position="absolute";
	
	if ( asynchContextMenuDebug < 2 )
	{
		dialogTag.style.left = "0px";
		dialogTag.style.top  = "-100px";
    	dialogTag.style.visibility = "hidden";
	}
	
	if ( asynchContextMenuDebug >= 2 || asynchContextMenuDebug == 999 )
	{
		dialogTag.style.left = "100px";
		dialogTag.style.top  = "100px";
    	dialogTag.style.visibility = "visible";
	}		
	
	dialogTag.id=ID;
	
	var styleString = 'null, null';
	
	if ( menuItemStyle != null )
	{
		styleString = "'" + menuItemStyle + "'";
	}
	
	if ( menuItemSelectedStyle != null ) 
	{
		styleString = styleString + ", '" + menuItemSelectedStyle + "'";
	}
	else
	{
		styleString = styleString + ", null";
	}
    
    //create the iframe this way because onload handlers attached when creating dynamically don't seem to fire
    dialogTag.innerHTML='<iframe id="' + menuID + '" name="' + ID + '_IFRAME" src="' + url + '" onload="buildAndDisplayMenu( this.id, this.name, ' + styleString + ' ); return false;" ></iframe>';
		
	//append the div tag to the document body		
	document.body.appendChild( dialogTag );

    asynchDebug( 'EXIT createDynamicElements' );
}

function asynchDebug( str ) 
{
	if ( asynchContextMenuDebug >= 1 && asynchContextMenuDebug != 999 )
	{
	    alert( str );
	}
}

function asynchDebug2( str )
{
	if ( asynchContextMenuDebug >= 0 && asynchContextMenuDebug != 999 )
	{
    	alert( str) ;
    }
}

//MMD - this function is used so that relative URLs may be used with the context menus.
function asynchDoFormSubmit( url ){

    var formElem = document.createElement("form");
    document.body.appendChild(formElem);

    formElem.setAttribute("method", "GET");

    var delimLocation = url.indexOf("?");
    
    if (delimLocation >= 0) {
        var newUrl = url.substring(0, delimLocation);
        
        var paramsEnd = url.length;
        // test to see if a # fragment identifier (the layout node id) is appended to the end of the URL
        var layoutNodeLocation = url.indexOf("#");
        if (layoutNodeLocation >= 0 && layoutNodeLocation > delimLocation) {
            paramsEnd = layoutNodeLocation;
            newUrl = newUrl + url.substring(layoutNodeLocation, url.length);
        }
        
        var params = url.substring(delimLocation + 1, paramsEnd);
        var paramArray = params.split("&");

        for (var i = 0; i < paramArray.length; i++) {
            var name = paramArray[i].substring(0, paramArray[i].indexOf("="));
            var value = paramArray[i].substring(paramArray[i].indexOf("=") + 1, paramArray[i].length);

            var inputElem = document.createElement("input");
            inputElem.setAttribute("type", "hidden");
            inputElem.setAttribute("name", name);
            inputElem.setAttribute("value", value);
            formElem.appendChild(inputElem);
        }
        
        url = newUrl;

    }

    formElem.setAttribute("action", url);
    
    formElem.submit();

}

var asynchContextMenu_menuCurrentlyLoading = null;

function menuMouseOver( id, selectedImage )
{
	if ( asynchContextMenu_menuCurrentlyLoading != null )
		return;

	portletIdMap[id] = 'menu_'+id+'_img';
	showAffordance(id, selectedImage);
}

function menuMouseOut( id, disabledImage )
{
	if ( asynchContextMenu_menuCurrentlyLoading != null )
		return;
	
   	hideAffordance(id , disabledImage);
	portletIdMap[id] = "";
}

function showAffordance( id, selectedImage )
{
	document.getElementById( 'menu_'+id ).style.cursor='pointer';
	document.getElementById( 'menu_'+id+'_img').src=selectedImage;
}

function hideAffordance( id, disabledImage )
{
	document.getElementById( 'menu_'+id ).style.cursor='default';
	document.getElementById( 'menu_'+id+'_img').src=disabledImage;	
}

function menuMouseOverThinSkin(id, selectedImage, minimized)
{
	if ( asynchContextMenu_menuCurrentlyLoading != null )
		return;

	portletIdMap[id] = 'menu_'+id+'_img';
	showAffordanceThinSkin(id, selectedImage, minimized);
}

function menuMouseOutThinSkin(id, disabledImage, minimized )
{
	if ( asynchContextMenu_menuCurrentlyLoading != null)
		return;

   	hideAffordanceThinSkin(id , disabledImage, minimized);
	portletIdMap[id] = "";
}

function showAffordanceThinSkin(id, selectedImage, minimized)
{
	document.getElementById( 'menu_'+id ).style.cursor='pointer';
	document.getElementById( 'portletTitleBar_'+id ).className='wpsThinSkinContainerBar wpsThinSkinContainerBarBorder';
	document.getElementById( 'title_'+id ).className='wpsThinSkinDragZoneContainer wpsThinSkinVisible';
	document.getElementById( 'menu_'+id+'_img' ).src=selectedImage;
}

function hideAffordanceThinSkin(id, disabledImage, minimized)
{
	document.getElementById( 'menu_'+id ).style.cursor='default';
	/* when minimized, the titlebar should always be displayed so it can be found by the user, so we don't hide it */
	if (minimized == null || minimized == false){
	document.getElementById( 'portletTitleBar_'+id ).className='wpsThinSkinContainerBar';
	}
	document.getElementById( 'title_'+id ).className='wpsThinSkinDragZoneContainer wpsThinSkinInvisible';
	document.getElementById( 'menu_'+id+'_img' ).src=disabledImage;	
}

var onmousedownold_;

function closeMenu(id, disabledImage)
{
	hideCurrentContextMenu();

	if (  portletIdMap[id] == "")
	{
		hideAffordance( id, disabledImage );
	}
	
	document.onmousedown = onmousedownold_;
}

function showPortletMenu( id, portletNoActionsText, isRTL, menuPortletURL, disabledImage, loadingImage )
{
	if ( portletIdMap[id].indexOf( id ) < 0  )
		return;
		
	asynchContextMenuOnMouseClickHandler('menu_'+id,!isRTL,menuPortletURL, null, null, null, null, portletNoActionsText, loadingImage );
   	onmousedownold_ = document.onmousedown;
	document.onmousedown = closeMenu;
}

function accessibleShowMenu( event , id , portletNoActionsText, isRTL, menuPortletURL, loadingImage )
{
	if ( event.which == 13 )
	{
	    asynchContextMenuOnMouseClickHandler( 'menu_'+id,!isRTL,menuPortletURL, null, null, null, null, portletNoActionsText, loadingImage );
	}
	else
	{
	 	return true;
	}
}

wptheme_AsyncMenuAffordance = function ( /*String*/anchorId, /*String*/imageId, /*String*/showingImgUrl, /*String*/hidingImgUrl ) {
	// summary: Representation of an asynchronous menu's affordance (UI element which triggers the menu to show). Manages the details
	//		of showing/hiding the affordance, if appropriate.
	// description: In the Portal theme, we want the menu affordance to only show during certain events (e.g. mouseover the page name). The details
	//		of the showing/hiding is a little more complicated than changing the css on an HTML element due to various rendering/accessibility concerns. This 
	//		object manages these details. 
	this.anchorId = anchorId;
	this.imageId = imageId;
	this.showingImgUrl = showingImgUrl;
	this.hidingImgUrl = hidingImgUrl;
	
	this.show = function () {
		// summary: Shows the affordance.		
		if (document.getElementById( this.anchorId ) != null) {
			document.getElementById( this.anchorId ).style.cursor = 'pointer';
			document.getElementById( this.imageId ).src=this.showingImgUrl;
		}	
	}
	this.hide = function () {
		// summary: Hides the affordance.
		if (document.getElementById( this.anchorId ) != null) {
			document.getElementById( this.anchorId ).style.cursor = 'default';
			document.getElementById( this.imageId ).src=this.hidingImgUrl;
		}
	}
}

wptheme_AsyncMenu = function ( /*String*/id, /*String*/menuBorderStyle, /*String*/menuStyle, /*String*/menuItemStyle, /*String*/selectedMenuItemStyle ) {
		// summary: Representation of an asynchronous context menu. Manages showing/hiding the menu as well as showing/hiding the menu's affordance (UI element
		//		which opens the menu). 
		// id: the menu's id
		// menuBorderStyle: the style name to be applied to the menu's border
		// menuStyle: the style name to be applied to the general menu
		// menuItemStyle: the style name to be applied to the menu item
		// selectedMenuItemStyle: the style name to be applied to a selected menu item
		
		//global utilities
		this._htmlUtils = wptheme_HTMLElementUtils;
		
		//properties passed in at construction time
		this.id = id;
		this.menuBorderStyle = menuBorderStyle; 
		this.menuStyle = menuStyle;
		this.menuItemStyle = menuItemStyle;
		this.selectedMenuItemStyle = selectedMenuItemStyle;
		
		//properties that have to be initialized in the theme
		this.url = null;
		this.isRTL = false;
		this.emptyMenuText = null;
		this.loadingImgUrl = null;
		this.affordance = null;
		this.init = function ( /*String*/ url, /*boolean*/isRTL, /*String*/ emptyMenuText, /*String*/ loadingImgUrl, /*wptheme_MenuAffordance*/affordance, /*boolean*/renderBelow ) {
			// summary: Convenience function for setting up the required variables for showing the page menu.
			// url: the url to load page menu contents (usually created with <portal-navgation:url themeTemplate="pageContextMenu" />)
			// isRTL: is the current locale a right-to-left locale
			// emptyMenuText: the text to display if the user has no valid options
			// loadingImgUrl: the url to the image to display while the menu is loading
			this.url = url;
			this.isRTL = isRTL;
			this.emptyMenuText = emptyMenuText;
			this.loadingImgUrl = loadingImgUrl;
			this.affordance = affordance;
			this.renderBelow = renderBelow;
		}
		this.show = function ( /*Event?*/evt ) {
			// summary: Shows the page menu for the selected page. 
			// description: Typically triggered by 2 types of events: click and keypress. On a click event, we just want to show the menu. On a keypress
			//		event, we want to make sure the ENTER/RETURN key was pressed before showing the menu.
			// event: Event object passed in when triggered from a key press event.
			
			evt = this._htmlUtils.getEventObject( evt );
			var show = false;
			var result;
			//On a keypress event, we want to make sure the ENTER/RETURN key was pressed before showing the menu.
			if ( evt && evt.type == "keypress" ) { 
				var keyCode = -1;
				if ( evt && evt.which ){	
					keyCode = evt.which;
				}
				else {
					keyCode = evt.keyCode
				}	
		
				//Enter/Return was the key that triggered this keypress event.
				if ( keyCode == 13 ) {
					show = true;
				}						
			}
			else {
				//Some other kind of event, just show the menu already...
				show = true;
			}
			
			//Show the menu if necessary.
			if ( show ) {
				result = asynchContextMenuOnMouseClickHandler( this.id, !this.isRTL, this.url, this.menuBorderStyle, this.menuStyle, this.menuItemStyle, this.selectedMenuItemStyle, this.emptyMenuText, this.loadingImgUrl, this.renderBelow );
			} 
			
			return result;
		}
		this.showAffordance = function () {
			// summary: Shows the affordance associated with the given asynchronous menu. 
			if ( asynchContextMenu_menuCurrentlyLoading == null ) {
				this.affordance.show();
			}	
		}
		this.hideAffordance = function () {
			// summary: Hides the affordance associated with the given asynchronous menu.
			if ( asynchContextMenu_menuCurrentlyLoading == null ) {
				this.affordance.hide();
			}
		}
	}

wptheme_ContextMenuUtils = {
	// summary: Utility object for managing the different context menus in the theme. Constructs the wptheme_AsyncMenu objects here, initialization must take place in
	//		the head section of the HTML document (usually the initialization values require the usage of JSP tags). 
	moreMenu: new wptheme_AsyncMenu( "wptheme_more_menu", "wptheme-more-menu-border", "wptheme-more-menu", "wptheme-more-menu-item", "wptheme-more-menu-item-selected", true ),
	topNavPageMenu: new wptheme_AsyncMenu( "wptheme_selected_page_menu", "wptheme-page-menu-border", "wptheme-page-menu", "wptheme-page-menu-item", "wptheme-page-menu-item-selected" ),
	sideNavPageMenu: new wptheme_AsyncMenu( "wptheme_selected_page_menu", "wptheme-page-menu-border", "wptheme-page-menu", "wptheme-page-menu-item", "wptheme-page-menu-item-selected" )
}



