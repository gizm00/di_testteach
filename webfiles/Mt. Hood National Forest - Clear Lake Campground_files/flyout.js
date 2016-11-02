 
// Global variables 
var wpsFLY_isIE = document.all?1:0;
var wpsFLY_isNetscape=document.layers?1:0;                             
var wpsFLY_isMoz = document.getElementById && !document.all;

// This sets how many pixels of the tab should show when collapsed was 11
var wpsFLY_minFlyout=0;

// How many pixels should it move every step? 
var wpsFLY_move=15;
if (wpsFLY_isIE)
   wpsFLY_move=12;

// Specify the scroll speed in milliseconds
var wpsFLY_scrollSpeed=1;

// Timeout ID for flyout
var wpsFLY_timeoutID=1;

// How from from top of screen for scrolling
var wpsFLY_fromTop=100;
var wpsFLY_leftResize;

//Cross browser access to required dimensions 
var wpsFLY_browserDimensions = new BrowserDimensions();

var wpsFLY_initFlyoutExpanded = wpsFLY_getInitialFlyoutState();

// Current state of the flyout for the life of the request (true=in, false=out)
var wpsFLY_state = true;

var wpsFLY_currIndex = -1;
// -----------------------------------------------------------------
// Initialize the Flyout
// -----------------------------------------------------------------
function wpsFLY_initFlyout(showHidden)
{
   wpsFLY_Flyout=new wpsFLY_makeFlyout('wpsFLYflyout');
   wpsFLY_Flyout.setWidth(wpsFLY_minFlyout);
   wpsFLY_Flyout.css.overflow = 'hidden';
   wpsFLY_Flyout.setLeft( wpsFLY_Flyout.pageWidth() - wpsFLY_minFlyout-1 );

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      scrolled="window.pageYOffset";
   else if (wpsFLY_isIE)
      scrolled="document.body.scrollTop";

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      wpsFLY_fromTop=wpsFLY_Flyout.css.top;
   else if (wpsFLY_isIE)
      wpsFLY_fromTop=wpsFLY_Flyout.css.pixelTop;

   if (wpsFLY_isIE) {
      window.onscroll=wpsFLY_internalScroll;
      window.onresize=wpsFLY_internalScroll;
   }
   else {
     window.onscroll=wpsFLY_internalScroll();
   }

   if (showHidden)
      wpsFLY_Flyout.css.visibility="hidden";
   else
      wpsFLY_Flyout.css.visibility="visible";

   //Open or close the flyout depending on the init state.
   if ( wpsFLY_initFlyoutExpanded != null )
   {
       wpsFLY_toggleFlyout( wpsFLY_initFlyoutExpanded, true );
   }

   return;
}

// -----------------------------------------------------------------
// Initialize the Flyout on left
// -----------------------------------------------------------------
function wpsFLY_initFlyoutLeft(showHidden)
{
   wpsFLY_FlyoutLeft=new wpsFLY_makeFlyoutLeft('wpsFLYflyout');

   if (wpsFLY_isIE) {
      wpsFLY_FlyoutLeft.setWidth(wpsFLY_minFlyout);
      wpsFLY_FlyoutLeft.css.overflow = 'hidden';
	   wpsFLY_FlyoutLeft.setLeft(0);
   } else {
      //  Mozilla does not move the scroll to the left for bidi languages
	   wpsFLY_FlyoutLeft.setLeft(wpsFLY_minFlyout - wpsFLY_FlyoutLeft.getWidth()- 4);
   }

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      scrolled="window.pageYOffset";
   else if (wpsFLY_isIE)
      scrolled="document.body.scrollTop";

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      wpsFLY_fromTop=wpsFLY_FlyoutLeft.css.top;
   else if (wpsFLY_isIE)
      wpsFLY_fromTop=wpsFLY_FlyoutLeft.css.pixelTop;

   if (wpsFLY_isIE) {
      window.onscroll=wpsFLY_internalScrollLeft;
      window.onresize=wpsFLY_internalResizeLeft;
   } else
      window.onscroll=wpsFLY_internalScrollLeft();

   if (showHidden)
      wpsFLY_FlyoutLeft.css.visibility="hidden";
   else
      wpsFLY_FlyoutLeft.css.visibility="visible";
      
   //Open or close the flyout depending on the init state.
   if ( wpsFLY_initFlyoutExpanded != null )
   {
       wpsFLY_toggleFlyout( wpsFLY_initFlyoutExpanded, true );
   }   
}


// -----------------------------------------------------------------
// Constructs flyout (default on right)
// -----------------------------------------------------------------
function wpsFLY_makeFlyout(obj)
{
   this.origObject=document.getElementById(obj);
   //get the css for the DIV tag, need it later
   if (wpsFLY_isNetscape)
      this.css=eval('document.'+obj);
   else if (wpsFLY_isMoz)
      this.css=document.getElementById(obj).style;
   else if (wpsFLY_isIE)
      this.css=eval(obj+'.style');

   //initialize the expand state
   wpsFLY_state=1;
   this.go=0;

   //get the width
   if (wpsFLY_isNetscape)
      this.width=this.css.document.width;
   else if (wpsFLY_isMoz)
      this.width=document.getElementById(obj).offsetWidth;
   else if (wpsFLY_isIE)
      this.width=eval(obj+'.offsetWidth');

   this.setWidth=wpsFLY_internalSetWidth;
   this.getWidth=wpsFLY_internalGetWidth;
   
   //set a left method to make it common across browsers
   this.left=wpsFLY_internalGetLeft;
   this.pageWidth=wpsFLY_internalGetPageWidth;
   this.setLeft = wpsFLY_internalSetLeft;

   this.obj = obj + "Object";   
   eval(this.obj + "=this");  
}

// -----------------------------------------------------------------
// Constructs flyout (on left)
// -----------------------------------------------------------------
function wpsFLY_makeFlyoutLeft(obj)        
{
   this.origObject=document.getElementById(obj);
	//get the css for the DIV tag, need it later
    if (wpsFLY_isNetscape) 
		this.css=eval('document.'+obj);
    else if (wpsFLY_isMoz) 
		this.css=document.getElementById(obj).style;
    else if (wpsFLY_isIE) 
		this.css=eval(obj+'.style');

	//initialize the expand state
	wpsFLY_state=1;
	this.go=0;
	
	//get the width
	if (wpsFLY_isNetscape) 
		this.width=this.css.document.width;
    else if (wpsFLY_isMoz) 
		this.width=document.getElementById(obj).offsetWidth;
    else if (wpsFLY_isIE) 
		this.width=eval(obj+'.offsetWidth');

   this.setWidth=wpsFLY_internalSetWidthLeft;
   this.getWidth=wpsFLY_internalGetWidthLeft;

	//set a left method to make it common across browsers
	this.left=wpsFLY_internalGetLeft;
   this.pageWidth=wpsFLY_internalGetPageWidth;
   this.setLeft = wpsFLY_internalSetLeft;

   this.obj = obj + "Object"; 	
   eval(this.obj + "=this");	
}


// -----------------------------------------------------------------
// The internal api to get the page width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetPageWidth()
{
   //get the width
   return wpsFLY_browserDimensions.getViewableAreaWidth();
}

function wpsFLY_internalSetLeft( value )
{
    this.css.left=value + "px";
}

// -----------------------------------------------------------------
// The internal api to set the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalSetWidth(value)
{
   this.css.width = value + "px";
   if (navigator.userAgent.indexOf ("Opera") != -1) {
      var operaIframe=document.getElementById('wpsFLY_flyoutIFrame');
      operaIframe.style.width = (value-wpsFLY_minFlyout) + "px" ;
   }
}

// -----------------------------------------------------------------
// The internal api to set the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalSetWidthLeft(value)
{
   this.css.width = value + "px";
   if (navigator.userAgent.indexOf ("Opera") != -1) {
      var operaIframe=document.getElementById('wpsFLY_flyoutIFrame');
      operaIframe.style.width = (value-wpsFLY_minFlyout) + "px" ;
   }
}

// -----------------------------------------------------------------
// The internal api to get the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetWidth()
{
   //get the width
   if (wpsFLY_isNetscape)
      return eval(this.css.document.width);
   else if (wpsFLY_isMoz||wpsFLY_isIE)
      return eval(this.origObject.offsetWidth);
}

// -----------------------------------------------------------------
// The internal api to get the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetWidthLeft()
{
   var width;
   if (wpsFLY_isNetscape)
      width = eval(this.css.document.width);
   else if (wpsFLY_isMoz||wpsFLY_isIE)
      width = eval(this.origObject.offsetWidth);
   return width;
}

// -----------------------------------------------------------------
// The internal api to get the left value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetLeft()
{
   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      leftfunc=parseInt(this.css.left);
   else if (wpsFLY_isIE)
      leftfunc=eval(this.css.pixelLeft);
   return leftfunc;
}

// -----------------------------------------------------------------
// The internal fly out function, called my real function, only 
// wpsFLY_moveOutFlyout should call this function.
// -----------------------------------------------------------------
function wpsFLY_internalMoveOut()
{
	document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";

   if (wpsFLY_Flyout.left() - wpsFLY_move > wpsFLY_Flyout.pageWidth()+ wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_Flyout.width ) {
      var newwidth= wpsFLY_Flyout.getWidth()+wpsFLY_move;
      wpsFLY_Flyout.setWidth(newwidth);
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.left() - wpsFLY_move);
      wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveOut()",wpsFLY_scrollSpeed);
      wpsFLY_Flyout.go=1;
   } else {
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.pageWidth() + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_Flyout.width);
      wpsFLY_Flyout.setWidth(wpsFLY_Flyout.width);
      wpsFLY_Flyout.go=0;
      wpsFLY_state=0;
   }
}

// -----------------------------------------------------------------
// The internal slide out function, called my real function, only 
// wpsFLY_moveOutFlyoutLeft should call this function. For left sided
// flyout.
// -----------------------------------------------------------------
function wpsFLY_internalMoveOutLeft()
{
	document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";

   if (wpsFLY_isIE) {
	   if (wpsFLY_FlyoutLeft.getWidth() + wpsFLY_move < wpsFLY_FlyoutLeft.width) {
         var newwidth= wpsFLY_FlyoutLeft.getWidth()+wpsFLY_move;
         wpsFLY_FlyoutLeft.setWidth(newwidth);
		   wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveOutLeft()",wpsFLY_scrollSpeed);
		   wpsFLY_FlyoutLeft.go=1;
	   } else {
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_FlyoutLeft.left());
         wpsFLY_FlyoutLeft.setWidth(wpsFLY_FlyoutLeft.width);
		   wpsFLY_FlyoutLeft.go=0;
		   wpsFLY_state=0;
	   }   
   } else {
   //  Mozilla browsers don't scroll left
      if( wpsFLY_FlyoutLeft.left()+wpsFLY_move < wpsFLY_browserDimensions.getScrollFromLeft()) {
		   wpsFLY_FlyoutLeft.go=1;
		   wpsFLY_FlyoutLeft.setLeft(wpsFLY_FlyoutLeft.left()+wpsFLY_move);
		   wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveOutLeft()",wpsFLY_scrollSpeed);
	   } else {
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_browserDimensions.getScrollFromLeft());
		   wpsFLY_FlyoutLeft.go=0;
		   wpsFLY_state=0;
	   }
   }  
}

// -----------------------------------------------------------------
// The internal fly in function, called my real function, only 
// wpsFLY_moveInFlyout should call this function.
// -----------------------------------------------------------------
function wpsFLY_internalMoveIn()
{
   if ( wpsFLY_Flyout.left() + wpsFLY_move < wpsFLY_Flyout.pageWidth() + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_minFlyout  ) {
      wpsFLY_Flyout.go=1;
      var newwidth= wpsFLY_Flyout.getWidth()-wpsFLY_move;
      wpsFLY_Flyout.setWidth(newwidth);
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.left()+wpsFLY_move);
      wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveIn()",wpsFLY_scrollSpeed);
   } else {
      wpsFLY_Flyout.setWidth(wpsFLY_minFlyout);
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.pageWidth() + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_minFlyout);
      wpsFLY_Flyout.go=0;
      wpsFLY_state=1;
   }  
}

// -----------------------------------------------------------------
// The internal slide in function, called my real function, only 
// wpsFLY_moveInFlyoutLeft should call this function. For left sided
// flyout.
// -----------------------------------------------------------------
function wpsFLY_internalMoveInLeft()
{
   if (wpsFLY_isIE) {
      if (wpsFLY_FlyoutLeft.getWidth() - wpsFLY_move >  wpsFLY_minFlyout) {
         var newwidth= wpsFLY_FlyoutLeft.getWidth() - wpsFLY_move;
         wpsFLY_FlyoutLeft.setWidth(newwidth);
         wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveInLeft()",wpsFLY_scrollSpeed);
         wpsFLY_FlyoutLeft.go=1;
      } else {
         wpsFLY_FlyoutLeft.setWidth(wpsFLY_minFlyout);
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_FlyoutLeft.left());
         wpsFLY_FlyoutLeft.go=0;
         wpsFLY_state=1;
      }
   } else {
      if(wpsFLY_FlyoutLeft.left()>-wpsFLY_FlyoutLeft.width+wpsFLY_minFlyout) {
		   wpsFLY_FlyoutLeft.go=1;
		   wpsFLY_FlyoutLeft.setLeft(wpsFLY_FlyoutLeft.left()-wpsFLY_move);
		   wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveInLeft()",wpsFLY_scrollSpeed);
	   } else {
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_minFlyout - wpsFLY_FlyoutLeft.getWidth()- 4 );
		   wpsFLY_FlyoutLeft.go=0;
		   wpsFLY_state=1;
      }
	}
}

// -----------------------------------------------------------------
// The internal scroll function.
// -----------------------------------------------------------------
function wpsFLY_internalScroll() {
   if (!wpsFLY_Flyout.go) {

      //wpsFLY_Flyout.css.top=eval(scrolled)+parseInt(wpsFLY_fromTop);
      if (wpsFLY_state==1) {
         wpsFLY_Flyout.setLeft(wpsFLY_browserDimensions.getScrollFromLeft() + wpsFLY_browserDimensions.getViewableAreaWidth() - wpsFLY_minFlyout);
      } else {
         wpsFLY_Flyout.setLeft(wpsFLY_browserDimensions.getScrollFromLeft() + wpsFLY_browserDimensions.getViewableAreaWidth() - wpsFLY_Flyout.width);
      }
   }
   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      setTimeout('wpsFLY_internalScroll()',20);
}

// -----------------------------------------------------------------
// The internal scroll left function.
// -----------------------------------------------------------------
function wpsFLY_internalScrollLeft() {
   if (!wpsFLY_FlyoutLeft.go) {
      //wpsFLY_FlyoutLeft.css.top=eval(scrolled)+parseInt(wpsFLY_fromTop);

      // scroll horizontally for flyoutin 
      if (wpsFLY_state==1) {
         if (wpsFLY_isIE) {
            if (wpsFLY_leftResize == null) {
               wpsFLY_leftResize = wpsFLY_browserDimensions.getScrollFromLeft();
            }
            wpsFLY_FlyoutLeft.setWidth(wpsFLY_minFlyout);
            wpsFLY_FlyoutLeft.css.overflow = 'hidden';
            wpsFLY_FlyoutLeft.setLeft(wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_leftResize);
         } else {
            wpsFLY_FlyoutLeft.setLeft(wpsFLY_minFlyout + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_FlyoutLeft.getWidth() - 4);
         }
      }
   }

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      setTimeout('wpsFLY_internalScrollLeft()',20);

}

// -----------------------------------------------------------------
// The internal resize left function.
// -----------------------------------------------------------------
function wpsFLY_internalResizeLeft(){
      
   if (wpsFLY_isIE) {
      wpsFLY_leftResize = wpsFLY_browserDimensions.getScrollFromLeft(); - wpsFLY_browserDimensions.getViewableAreaWidth();
   }

}

// -----------------------------------------------------------------
// Expand the flyout. The parameter skipSlide indicates whether or not
// the flyout should simply be rendered without the slide-out effect.
// ----------------------------------------------------------------- 
function wpsFLY_moveOutFlyout( skipSlide )
{
   if (this.wpsFLY_Flyout != null)
   {
      if ( wpsFLY_state && !skipSlide ) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveOut(); 
      }
      
      if ( wpsFLY_state && skipSlide )
      {
          wpsFLY_Flyout.setLeft(wpsFLY_Flyout.pageWidth() + document.body.scrollLeft - wpsFLY_Flyout.width);
          wpsFLY_Flyout.setWidth(wpsFLY_Flyout.width);
          wpsFLY_Flyout.go=0;
          wpsFLY_state=0;
          document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";
      }
      
   }

   if (this.wpsFLY_FlyoutLeft != null)
   {      
      if ( wpsFLY_state && !skipSlide ) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveOutLeft(); 
      }
      
      if ( wpsFLY_state && skipSlide )
      {
      	 if ( wpsFLY_isIE )
      	 {
		     wpsFLY_FlyoutLeft.setLeft( wpsFLY_FlyoutLeft.left());
    	     wpsFLY_FlyoutLeft.setWidth(wpsFLY_FlyoutLeft.width);
			 wpsFLY_FlyoutLeft.go=0;
			 wpsFLY_state=0;	
		 }
		 else
		 {
		 	 wpsFLY_FlyoutLeft.setLeft( document.body.scrollLeft);
   		     wpsFLY_FlyoutLeft.go=0;
		     wpsFLY_state=0;
		 }
		 document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";
	  }
   }
}

// -----------------------------------------------------------------
// Called to close the flyout. This is the method that the function
// external to the flyout should call.
// ----------------------------------------------------------------- 
function wpsFLY_moveInFlyout()
{
   if (this.wpsFLY_Flyout != null)
   {
      if (!wpsFLY_state) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveIn();
      }
   }

   if (this.wpsFLY_FlyoutLeft != null)
   {
      if (!wpsFLY_state) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveInLeft();
      }
   }
   
   document.getElementById('wpsFLYflyout').className = "portalFlyoutCollapsed";
}

// -----------------------------------------------------------------
// Called to toggle the flyout. This is the method that the function
// external to the flyout should call.
// -----------------------------------------------------------------
function wpsFLY_toggleFlyout(index, skipSlide)
{
	if(flyOut[index] != null){
	var checkIndex = index;
	var prevIndex=wpsFLY_getCurrIndex();
	
	if(checkIndex==prevIndex){
        
		if(flyOut[index].active==true){
			flyOut[index].active=false;
            /*
			document.getElementById("toolBarIcon"+prevIndex).src = flyOut[prevIndex].icon;	
			document.getElementById("toolBarIcon"+prevIndex).alt = flyOut[prevIndex].altText;
			document.getElementById("toolBarIcon"+prevIndex).title = flyOut[prevIndex].altText;
			*/
		}
		else{
			flyOut[index].active=true;
            /*
			document.getElementById("toolBarIcon"+index).src = flyOut[index].activeIcon;
			document.getElementById("toolBarIcon"+index).alt = flyOut[index].activeAltText;
			document.getElementById("toolBarIcon"+index).title = flyOut[index].activeAltText;
			*/
		}
        //Closing flyout, clear the state cookie.
        wpsFLY_clearStateCookie();
        wpsFLY_moveInFlyout();
	}else{
		if(prevIndex > -1){
			flyOut[prevIndex].active=false;
            /*
			document.getElementById("toolBarIcon"+prevIndex).src = flyOut[prevIndex].icon;	
			document.getElementById("toolBarIcon"+prevIndex).alt = flyOut[prevIndex].altText;
			document.getElementById("toolBarIcon"+prevIndex).title = flyOut[prevIndex].altText;
			*/
		}
		
		flyOut[index].active=true;
        /*
		document.getElementById("toolBarIcon"+index).src = flyOut[index].activeIcon;
		document.getElementById("toolBarIcon"+index).alt = flyOut[index].activeAltText;
		document.getElementById("toolBarIcon"+index).title = flyOut[index].activeAltText;
		*/
		wpsFLY_setCurrIndex(index);
		document.getElementById("wpsFLY_flyoutIFrame").src = flyOut[index].url;
	}
	
	if(wpsFLY_state){
		
        //Expanding flyout, store the open flyout index in the state cookie.
        wpsFLY_setStateCookie( index );
        wpsFLY_moveOutFlyout( skipSlide );
		}
	}
}

function wpsFLY_getCurrIndex()
{
	return wpsFLY_currIndex;
}

function wpsFLY_setCurrIndex(index)
{
	wpsFLY_currIndex = index;
}

// -----------------------------------------------------------------
// Create a cookie to track the state of the flyout. The value of the 
// cookie is the index of the open flyout. The cookie is marked for 
// deletion when the browser closes and the path is set to ensure the 
// cookie is valid for the entire site.
// -----------------------------------------------------------------
function wpsFLY_setStateCookie( index )
{
    document.cookie='portalOpenFlyout=' + index + '; path=/;';
}

// -----------------------------------------------------------------
// Clear the cookie by changing the value to null. By setting the expiration date in 
// the past, the cookie is marked for deletion when the browser closes.
// -----------------------------------------------------------------
function wpsFLY_clearStateCookie()
{
    document.cookie='portalOpenFlyout=null; expires=Wed, 1 Jan 2003 11:11:11 UTC; path=/;';
}

// -----------------------------------------------------------------
// Check which side of the page the flyout should show on
// -----------------------------------------------------------------
function wpsFLY_onloadShow( isRTL )
{
  if (this.wpsFLY_minFlyout != null) {
    var bodyObj = document.getElementById("FLYParent");
    if (bodyObj != null) {
      var showHidden = false;
      if (isRTL) { 
           bodyObj.onload = wpsFLY_initFlyoutLeft(showHidden);
       } else { 
      	   bodyObj.onload = wpsFLY_initFlyout(showHidden);
       } 	 
    }
  }
 }
// -----------------------------------------------------------------
// Write markup out to document for all flyout items
// -----------------------------------------------------------------
function wpsFLY_markupLoop( flyOut)
{	
 	for(arrayIndex = 0; arrayIndex < flyOut.length; arrayIndex++){
		if(flyOut[arrayIndex].url != "" && flyOut[arrayIndex].url != null){
			document.write('<li><a id="globalActionLink'+arrayIndex+'" href="javascript:void(0);" onclick="wpsFLY_toggleFlyout('+arrayIndex+'); return false;" >');
			document.write(flyOut[arrayIndex].altText);
            //document.write('<img src="'+flyOut[arrayIndex].icon+'" id="toolBarIcon'+arrayIndex+'" title="'+flyOut[arrayIndex].altText+'" border="0" alt="'+flyOut[arrayIndex].altText+'" onmouseover="this.src=flyOut['+arrayIndex+'].hoverIcon;" onmouseout="if (flyOut['+arrayIndex+'].active) {this.src=flyOut['+arrayIndex+'].activeIcon;} else this.src=flyOut['+arrayIndex+'].icon;" />');            
			document.write('</a></li>');
		}
		
		if ( javascriptEventController )
		{
			javascriptEventController.register( "globalActionLink" + arrayIndex );
			//javascriptEventController.register( "toolBarIcon" + arrayIndex );
		}
	}
}

// -----------------------------------------------------------------
// If we have an empty expanded flyout (via the back button), load 
// the previously open flyout.
// -----------------------------------------------------------------
function wpsFLY_checkForEmptyExpandedFlyout()
{
	var index = wpsFLY_getInitialFlyoutState();
	
	if ( index != null && flyOut[index] != null)
	{
		document.getElementById("wpsFLY_flyoutIFrame").src = flyOut[index].url;
	}
}

// -----------------------------------------------------------------
// Determine if the flyout should initially open and which flyout 
// should be loaded. 
// -----------------------------------------------------------------
function wpsFLY_getInitialFlyoutState()
{
	// Determine if the flyout's initial state is open or closed.
	if ( document.cookie.indexOf( "portalOpenFlyout=" ) >= 0 )
	{
	    var cookies = document.cookie.split(";");
	
	    var c = 0;
	    while ( c < cookies.length && ( cookies[c].indexOf( "portalOpenFlyout=" ) == -1 ) )
	    {
	        c=c+1;
	    }
	
	    initCookieValue = cookies[c].substring( 18, cookies[c].length );
	    
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
