//Provides a controller for enabling and disabling javascript events
//on a particular HTML element. Elements must register with the controller
//in order to be enabled/disabled. The act of registering with the controller
//disables the element, unless otherwise specified. 
//
//
// **The main purpose of this controller is to disable the javascript 
//actions of certain elements that, if executed prior to the page completely 
//loading, cause problems.

//Object definition for ElementJavascriptEventController
function ElementJavascriptEventController()
{
	//Registered elements to disable and enable upon page load.
	this.elements = new Array();
	this.arrayPosition = 0;
	
	//Function mappings
	this.enableAll = enableRegisteredElementsInternal;
	this.disableAll = disableRegisteredElementsInternal;
	this.register = registerElementInternal;
	this.enable = enableRegisteredElementInternal;
	this.disable = disableRegisteredElementInternal;
	
	//Enables all registered items.
	function enableRegisteredElementsInternal()
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			this.elements[c].enable();	
		}
	}
	
	function enableRegisteredElementInternal( id )
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			if ( this.elements[c].ID == id )
			{
				this.elements[c].enable();
			}
		}
	}
	
	//Disables all registered items.
	function disableRegisteredElementsInternal()
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			this.elements[c].disable();
		}
	}
	
	function disableRegisteredElementInternal( id )
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			if ( this.elements[c].ID == id )
			{
				this.elements[c].disable();
			}
		}
	}
	
	//Registers an item with the controller.
	function registerElementInternal( HTMLElementID, doNotDisable, optionalOnEnableJavascriptAction )
	{
		this.elements[ this.arrayPosition ] = new RegisteredElement( HTMLElementID, doNotDisable, optionalOnEnableJavascriptAction );
		this.arrayPosition = this.arrayPosition + 1;
	}
}

//Object definition for an element registered with the controller.
//These objects should only be created by the controller.
function RegisteredElement( ElementID, doNotDisable, optionalOnEnableJavascriptAction )
{
	//Information about the element.
	this.ID = ElementID;
	this.oldCursor = "normal";
	this.ItemOnMouseDown = null;
	this.ItemOnMouseUp = null;
	this.ItemOnMouseOver = null;
	this.ItemOnMouseOut = null;
	this.ItemOnMouseClick = null;
	this.ItemOnBlur = null;
	this.ItemOnFocus = null;
	this.ItemOnChange = null;
	this.onEnableJS = optionalOnEnableJavascriptAction;
	
	//Function mappings
	this.enable = enableInternal;
	this.disable = disableInternal;
	
	//Enables an element. Enabling consists of changing the cursor
	//style back to the original style, and returning all the stored
	//javascript events to their original state. If the HTML element
	//is a button, the disabled property is simply set to false.
	function enableInternal()
	{
		//Return the old cursor style.
		document.getElementById( this.ID ).style.cursor = this.oldCursor;
		
		//If it's a button, re-enable it.
		if ( document.getElementById( this.ID ).tagName == "BUTTON" )
		{
			document.getElementById( this.ID ).disabled = false;
		}
		else
		{
			//Return all the events.
			document.getElementById( this.ID ).onmousedown = this.ItemOnMouseDown;
			document.getElementById( this.ID ).onmouseup = this.ItemOnMouseUp;
			document.getElementById( this.ID ).onmouseover = this.ItemOnMouseOver;
			document.getElementById( this.ID ).onmouseout = this.ItemOnMouseOut;
			document.getElementById( this.ID ).onclick = this.ItemOnMouseClick;
			document.getElementById( this.ID ).onblur = this.ItemOnBlur;
			document.getElementById( this.ID ).onfocus = this.ItemOnFocus;
			document.getElementById( this.ID ).onchange = this.ItemOnChange;	
		}
		
		//Execute the onEnable Javascript, if specified.
		if ( this.onEnableJS != null )
		{
			eval( this.onEnableJS );
		}
	}
	
	//Disables an element. Disabling consists of changing the cursor
	//style to "not-allowed", and setting all the javascript events to
	//do nothing. If the HTML element is a button, the "disabled" property
	//is simply set to true.	
	function disableInternal() 
	{
		//Set the cursor style to point out that you can't do anything yet
		this.oldCursor = document.getElementById( this.ID ).style.cursor;
		document.getElementById( this.ID ).style.cursor = "not-allowed";
	
		//If the HTML element is a BUTTON, we can easily disable it by
		//setting the disabled property to true.
		if ( document.getElementById( this.ID ).tagName == "BUTTON" )
		{
			document.getElementById( this.ID ).disabled = true;
		}
		else
		{
			//Store all the current events registered to the item.
			this.ItemOnMouseDown = document.getElementById( this.ID ).onmousedown;
			this.ItemOnMouseUp = document.getElementById( this.ID ).onmouseup;
			this.ItemOnMouseOver = document.getElementById( this.ID ).onmouseover;
			this.ItemOnMouseOut = document.getElementById( this.ID ).onmouseout;
			this.ItemOnMouseClick = document.getElementById( this.ID ).onclick;
			this.ItemOnBlur = document.getElementById( this.ID ).onblur;
			this.ItemOnFocus = document.getElementById( this.ID ).onfocus;
			this.ItemOnChange = document.getElementById( this.ID ).onchange;
			
			//Now set all the current events to do nothing.
			document.getElementById( this.ID ).onmousedown = function () { void(0); return false; };
			document.getElementById( this.ID ).onmouseup = function () { void(0); return false; };
			document.getElementById( this.ID ).onmouseover = function () { void(0); return false; };
			document.getElementById( this.ID ).onmouseout = function () { void(0); return false; };
			document.getElementById( this.ID ).onclick = function () { void(0); return false; };
			document.getElementById( this.ID ).onblur = function () { void(0); return false; };
			document.getElementById( this.ID ).onfocus = function () { void(0); return false; };
			document.getElementById( this.ID ).onchange = function () { void(0); return false; };
		}
	}		
	
	//Disable the element
	if ( !doNotDisable )
	{
		this.disable();	
	}
	
}