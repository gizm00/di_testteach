//////////////////////////////////////////////////////////////////
// begin BrowserDimensions object definition
BrowserDimensions.prototype				= new Object();
BrowserDimensions.prototype.constructor = BrowserDimensions;
BrowserDimensions.superclass			= null;

function BrowserDimensions(){

    this.body = document.body;
    if (this.isStrictDoctype() && !this.isSafari()) {
        this.body = document.documentElement;
    }

}

BrowserDimensions.prototype.getScrollFromLeft = function(){
    return this.body.scrollLeft ;
}

BrowserDimensions.prototype.getScrollFromTop = function(){
    return this.body.scrollTop ;
}

BrowserDimensions.prototype.getViewableAreaWidth = function(){
    return this.body.clientWidth ;
}

BrowserDimensions.prototype.getViewableAreaHeight = function(){
    return this.body.clientHeight ;
}

BrowserDimensions.prototype.getHTMLElementWidth = function(){
    return this.body.scrollWidth ;
}

BrowserDimensions.prototype.getHTMLElementHeight = function(){
    return this.body.scrollHeight ;
}

BrowserDimensions.prototype.isStrictDoctype = function(){

    return (document.compatMode && document.compatMode != "BackCompat");

}

BrowserDimensions.prototype.isSafari = function(){

    return (navigator.userAgent.toLowerCase().indexOf("safari") >= 0);

}

// end BrowserDimensions object definition
//////////////////////////////////////////////////////////////////

