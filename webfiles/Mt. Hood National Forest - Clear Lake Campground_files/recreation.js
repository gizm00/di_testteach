function raalp_toggledesc(anchobj, divid){
var linktext = anchobj.innerHTML;
var divobj = document.getElementById(divid);
linktext = linktext + "";
var newtext = "";

if (linktext.indexOf("plus.gif") != -1){
	newtext = linktext.replace("plus.gif","minus.gif");

	if (newtext.indexOf("SHOW") != -1){
	newtext = newtext.replace("SHOW","HIDE");
	}
	anchobj.innerHTML = newtext;	
	
if (divid.indexOf('act_') == 0){
	divobj.style.display='block';
	}
	else {
	divobj.style.display='inline';
	}
}

if (linktext.indexOf("minus.gif") != -1){
	newtext = linktext.replace("minus.gif","plus.gif");
	if (newtext.indexOf("HIDE") != -1){
		newtext = newtext.replace("HIDE","SHOW");
		}
	anchobj.innerHTML = newtext;
	divobj.style.display='none';
}

if (linktext == '[+]') {
anchobj.innerHTML = '[-]';
if (divid.indexOf('act_') == 0){
divobj.style.display='block';
}
else {
divobj.style.display='inline';
}
}

if (linktext == '[-]') {
anchobj.innerHTML = '[+]';
divobj.style.display='none';
}

if (linktext == 'SHOW [+]') {
	anchobj.innerHTML = 'HIDE [-]';
	if (divid.indexOf('act_') == 0){
	divobj.style.display='block';
	}
	else {
	divobj.style.display='inline';
	}
	}

if (linktext == 'HIDE [-]') {
	anchobj.innerHTML = 'SHOW [+]';
	divobj.style.display='none';
	}
}

function ajaxRequest(){
	 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
	 if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
	  for (var i=0; i<activexmodes.length; i++){
	   try{
	    return new ActiveXObject(activexmodes[i])
	   }
	   catch(e){
	    //suppress error
	   }
	  }
	 }
	 else if (window.XMLHttpRequest) // if Mozilla, Safari etc
	  return new XMLHttpRequest()
	 else
	  return false
	}

function switch_activity_view_ajax(recidp,actidp,pathp,obj){
	var recid = recidp;
	var actid = actidp;
	var moreorless = obj;
	var pathprefix = pathp;
	var myajaxrequest = new ajaxRequest();
	var moreorless_txt = obj.innerHTML;
	var divid = 'act_' + actid + '_vw';
	var divobj = document.getElementById(divid);
	var params = '';
	var ajaxresponse = '';
	myajaxrequest.onreadystatechange = function(){
			if (myajaxrequest.readyState==4){
				 if (myajaxrequest.status==200 || window.location.href.indexOf("http")==-1){
					 ajaxresponse = myajaxrequest.responseText;
					 divobj.innerHTML= ajaxresponse;
				 }
				 else{
				  alert("An error has occured making the request");
				 }
			}					
	}
	
	if (moreorless_txt == '[Read more]'){
		moreorless.innerHTML = '[Hide extra]';
		params = 'recid=' + recid + '&actid=' + actid + '&truncate=n';
	}
	if (moreorless_txt == '[Hide extra]'){
		moreorless.innerHTML = '[Read more]';
		params = 'recid=' + recid + '&actid=' + actid + '&truncate=y';
	}
	myajaxrequest.open("POST", pathprefix + "/activitydesc.jsp", true);
	myajaxrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	myajaxrequest.send(params);	
}

function switch_activity_view(recidp,actidp,pathp,obj){
	var moreorless = obj;	
	var moreorless_txt = obj.innerHTML;
	var actid = actidp;
	var msgp0 = document.getElementById('act_' + actid + '_vw_0');
	var msgp1 = document.getElementById('act_' + actid + '_vw_1');
	var msgp2 = document.getElementById('act_' + actid + '_vw_2');
	
	if (moreorless_txt == '[Expand Text]'){
		msgp0.style.display = 'none';
		msgp1.style.display = 'none';
		msgp2.style.display='inline';
		moreorless.innerHTML = '[Hide Extra]';
	}
	if (moreorless_txt == '[Hide Extra]'){
		msgp0.style.display = 'inline'
		msgp1.style.display = 'inline';
		msgp2.style.display='none';
		moreorless.innerHTML = '[Expand Text]';
	}
	
}
