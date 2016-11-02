function showdescendants(ss,recid,urlpath){
	var spanid = "rfbap_pid" + recid;
	var contid = "childcont" + recid;
	var spanobj = document.getElementById(spanid);
	var contobj = document.getElementById(contid);
	var progressind_obj = document.getElementById("progressind_" + recid);
	var expimgnew = "";
	var signch = "";
	var recarea_url_obj = document.getElementById("recarea_url");
	var recarea_url = recarea_url_obj.href;
	progressind_obj.style.display="inline";
	var expimg = spanobj.innerHTML + "";

	if (expimg.indexOf("Rplus.gif") != -1){
		expimgnew = expimg.replace("Rplus.gif", "Rminus.gif");
		spanobj.innerHTML = expimgnew;
		contobj.style.display="block";
	}
	
	if (expimg.indexOf("Rminus.gif") != -1){
		expimgnew = expimg.replace("Rminus.gif", "Rplus.gif");
		spanobj.innerHTML = expimgnew;
		contobj.style.display="none";
		progressind_obj.style.display="none";
		return;
	}
	
	var contobj_content = contobj.innerHTML + "";

	if (contobj_content.indexOf("tr") != -1) {
		//alert("result already in DOM - avoiding Ajax call");
		progressind_obj.style.display = "none"; return;
		}
		var mypostrequest=new ajaxRequest()
	mypostrequest.onreadystatechange=function(){
	 if (mypostrequest.readyState==4){
	  if (mypostrequest.status==200 || window.location.href.indexOf("http")==-1){//alert(mypostrequest.responseText);
	   document.getElementById("childcont" + recid).innerHTML=mypostrequest.responseText;
	   progressind_obj.style.display="none";
	  }
	  else{
	   alert("An error has occured making the request")
	  }
	 }
	}

	var parameters="ss=" + ss + "&recid=" + recid + "&urlpath=" + urlpath + "&recareaurl=" + recarea_url;
	mypostrequest.open("POST", urlpath + "/NextDescendants.jsp", true);
	mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	mypostrequest.send(parameters);	
}

function flipsign(id){
	var spanid = "rfbap_pid" + id;
	spanobj = document.getElementById(spanid);
	var signch = spanobj.innerHTML;
	if (signch == "[+]"){
		spanobj.innerHTML = "[-]";
	}
	if (signch == "[-]"){
		spanobj.innerHTML = "[+]";
	}
}

function ajaxRequest(){
	 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
	 if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
	  for (var i=0; i<activexmodes.length; i++){
	   try{
	    return new ActiveXObject(activexmodes[i]);
	   }
	   catch(e){
	    //suppress error
	   }
	  }
	 }
	 else if (window.XMLHttpRequest) // if Mozilla, Safari etc
	  return new XMLHttpRequest();
	 else
	  return false;
	}