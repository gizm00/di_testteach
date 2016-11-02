








function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);

function P7_OpResizeFix(a) { 
if(!window.opera){return;}if(!document.p7oprX){
 document.p7oprY=window.innerWidth;document.p7oprX=window.innerHeight;
 document.onmousemove=P7_OpResizeFix;
 }else{if(document.p7oprX){
  var k=document.p7oprX-window.innerHeight;
  var j=document.p7oprY - window.innerWidth;
  if(k>1 || j>1 || k<-1 || j<-1){
  document.p7oprY=window.innerWidth;document.p7oprX=window.innerHeight;
  location.reload();}}}
}
P7_OpResizeFix();


function MM_preloadimages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadimages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function spawn(expr,qty,reversed){

	var spawnee=[expr];

	for(s=1;s<qty;s++){
		spawnee[s]=expr+spawnee[s-1];
	}

	return reversed? spawnee.reverse() : spawnee();

}


function mw_crumbs(divider,default_page,root){

	if(!divider) {
		divider=" / "
	}

	if(!default_page){
//		default_page="index.html"    commented by Jaya Vatyani (NSGI) 02-17-2005
		default_page="index.shtml"
	}

	var m=location.toString(),h="";
	m=m.substring(m.indexOf("/")+2);
	m=m.split("/");
	var howmany=spawn("../",m.length,true);
	howmany[m.length]=default_page;

	
for(i=1;i<m.length-1;i++){
		h+=("<a href="+howmany[i+2]+">"+unescape( m[i]+"</a>"+divider))
	}	

	if(root) {
		//h=h.replace(eval("/"+location.host+"/"),root)
		h=h.replace(eval("/"+"Home"+"/"),root)
	}
	
h=h.toString("/");
	

	
	var inThere1 = h.match(/about-forest-service-egovernment/gi);
	
	if (inThere1) {
		rExp = /about-forest-service-egovernment/gi;
		newString = new String ("About&nbsp;Forest&nbsp;Service&nbsp;eGovernment")
	} else {
		rExp = / /gi;
		newString = new String (" ")
	}
	
	h = h.replace(rExp, newString)		//replacing old string with the new one

	var inThere1 = h.match(/presidential-initiatives/gi);

	if (inThere1) {
	rExp = /presidential-initiatives/gi;
	newString = new String ("Presidential&nbsp;Initiatives")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one

	var inThere1 = h.match(/forest-service-initiatives/gi);

	if (inThere1) {
	rExp = /forest-service-initiatives/gi;
	newString = new String ("Forest&nbsp;Service&nbsp;Initiatives")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one

	var inThere1 = h.match(/forest-service-egov-roadmap/gi);

	if (inThere1) {
	rExp = /forest-service-egov-roadmap/gi;
	newString = new String ("Forest&nbsp;Service&nbsp;eGov&nbsp;Roadmap")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one

	var inThere1 = h.match(/forest-service-employees/gi);

	if (inThere1) {
	rExp = /forest-service-employees/gi;
	newString = new String ("Forest&nbsp;Service&nbsp;Employees")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/forest-service-enterprise-architecture/gi);

	if (inThere1) {
	rExp = /forest-service-enterprise-architecture/gi;
	newString = new String ("Forest&nbsp;Service&nbsp;Enterprise&nbsp;Architecture")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/forest-service-partners/gi);

	if (inThere1) {
	rExp = /forest-service-partners/gi;
	newString = new String ("Forest&nbsp;Service&nbsp;Partners")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/help/gi);

	if (inThere1) {
	rExp = /help/gi;
	newString = new String ("Help")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one

	var inThere1 = h.match(/resources/gi);

	if (inThere1) {
	rExp = /resources/gi;
	newString = new String ("Resources")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/newsroom/gi);

	if (inThere1) {
	rExp = /newsroom/gi;
	newString = new String ("Newsroom")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/egov-team/gi);

	if (inThere1) {
	rExp = /egov-team/gi;
	newString = new String ("eGov&nbsp;Team")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/federal-government-resources/gi);

	if (inThere1) {
	rExp = /federal-government-resources/gi;
	newString = new String ("Federal&nbsp;Government&nbsp;Resources")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/faqs/gi);

	if (inThere1) {
	rExp = /faqs/gi;
	newString = new String ("FAQs")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/intranet/gi);

	if (inThere1) {
	rExp = /intranet/gi;
	newString = new String ("Intranet")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one			
	
	var inThere1 = h.match(/interested-citizens/gi);

	if (inThere1) {
	rExp = /interested-citizens/gi;
	newString = new String ("Interested&nbsp;Citizens")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	

	var inThere1 = h.match(/web-modernization-faq/gi);

	if (inThere1) {
	rExp = /web-modernization-faq/gi;
	newString = new String ("Web&nbsp;Modernization&nbsp;FAQs")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
		
	var inThere1 = h.match(/field-data-automation/gi);

	if (inThere1) {
	rExp = /field-data-automation/gi;
	newString = new String ("Field&nbsp;Data&nbsp;Automation")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/commercial-sales/gi);

	if (inThere1) {
	rExp = /commercial-sales/gi;
	newString = new String ("Commercial&nbsp;Sales")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/efoia/gi);

	if (inThere1) {
	rExp = /efoia/gi;
	newString = new String ("eFOIA")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/emnepa/gi);

	if (inThere1) {
	rExp = /emnepa/gi;
	newString = new String ("eMNEPA")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/environmental-education/gi);

	if (inThere1) {
	rExp = /environmental-education/gi;
	newString = new String ("Environmental&nbsp;Education")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/epermits/gi);

	if (inThere1) {
	rExp = /epermits/gi;
	newString = new String ("ePermits")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/financial-management/gi);

	if (inThere1) {
	rExp = /financial-management/gi;
	newString = new String ("Financial&nbsp;Management")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/improving-procurement/gi);

	if (inThere1) {
	rExp = /improving-procurement/gi;
	newString = new String ("Improving&nbsp;Procurement")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/interest-forums/gi);

	if (inThere1) {
	rExp = /interest-forums/gi;
	newString = new String ("Interest&nbsp;Forums")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/recreation-onestop/gi);

	if (inThere1) {
	rExp = /recreation-onestop/gi;
	newString = new String ("Recreation&nbsp;OneStop")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/virtual-expert-network/gi);

	if (inThere1) {
	rExp = /virtual-expert-network/gi;
	newString = new String ("Virtual&nbsp;Expert&nbsp;Network")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/distance-learning/gi);

	if (inThere1) {
	rExp = /distance-learning/gi;
	newString = new String ("Distance&nbsp;Learning")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/egrants/gi);

	if (inThere1) {
	rExp = /egrants/gi;
	newString = new String ("eGrants")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/employee-self-service/gi);

	if (inThere1) {
	rExp = /employee-self-service/gi;
	newString = new String ("Employee&nbsp;Self&nbsp;Service")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/environmental-law/gi);

	if (inThere1) {
	rExp = /environmental-law/gi;
	newString = new String ("Environmental&nbsp;Law")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/eresearch/gi);

	if (inThere1) {
	rExp = /eresearch/gi;
	newString = new String ("eResearch")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/forest-service-asset-management/gi);

	if (inThere1) {
	rExp = /forest-service-asset-management/gi;
	newString = new String ("Forest&nbsp;Service&nbsp;Asset&nbsp;Management")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/incident-planning-and-management/gi);

	if (inThere1) {
	rExp = /incident-planning-and-management/gi;
	newString = new String ("Incident&nbsp;Planning&nbsp;and&nbsp;Management")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/micro-purchases/gi);

	if (inThere1) {
	rExp = /micro-purchases/gi;
	newString = new String ("Micro&nbsp;Purchases")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/simplify-enhance-hiring/gi);

	if (inThere1) {
	rExp = /simplify-enhance-hiring/gi;
	newString = new String ("Simplify&nbsp;Enhance&nbsp;Hiring")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/comment-on-this-initiative/gi);

	if (inThere1) {
	rExp = /comment-on-this-initiative/gi;
	newString = new String ("Comment&nbsp;on&nbsp;this&nbsp;Initiative")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/web-site-design/gi);

	if (inThere1) {
	rExp = /web-site-design/gi;
	newString = new String ("Web&nbsp;Site&nbsp;Design")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/hosting-architecture/gi);

	if (inThere1) {
	rExp = /hosting-architecture/gi;
	newString = new String ("Hosting&nbsp;Architecture")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/migration-strategy/gi);

	if (inThere1) {
	rExp = /migration-strategy/gi;
	newString = new String ("Migration&nbsp;Strategy")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/project-documents/gi);

	if (inThere1) {
	rExp = /project-documents/gi;
	newString = new String ("Project&nbsp;Documents")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		


	var inThere1 = h.match(/contact-us/gi);

	if (inThere1) {
	rExp = /contact-us/gi;
	newString = new String ("Contact&nbsp;Us")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	//FS Initiaves
	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/enabling-initiatives/gi);

	if (inThere1) {
	rExp = /enabling-initiatives/gi;
	newString = new String ("Enabling&nbsp;Initiatives")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}
	
	
	h = h.replace(rExp, newString) //replacing old string with the new one
	
	var inThere1 = h.match(/recreation-onestop/gi);

	if (inThere1) {
	rExp = /recreation-onestop/gi;
	newString = new String ("Recreation&nbsp;OneStop")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
		
	var inThere1 = h.match(/strategic-initiatives/gi);

	if (inThere1) {
	rExp = /strategic-initiatives/gi;
	newString = new String ("Strategic&nbsp;Initiatives")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one

	var inThere1 = h.match(/eGovernment-faqs/gi);

	if (inThere1) {
	rExp = /eGovernment-faqs/gi;
	newString = new String ("eGovernment&nbsp;FAQs")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
		
	var inThere1 = h.match(/presidential-initiatives/gi);

	if (inThere1) {
	rExp = /presidential-initiatives/gi;
	newString = new String ("Presidential&nbsp;Initiatives")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
		
	var inThere1 = h.match(/Technical_help/gi);

	if (inThere1) {
	rExp = /Technical_help/gi;
	newString = new String ("Technical&nbsp;help")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
					
	var inThere1 = h.match(/web-modernization/gi);

	if (inThere1) {
	rExp = /web-modernization/gi;
	newString = new String ("Web&nbsp;Modernization")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/web-manager/gi);

	if (inThere1) {
	rExp = /web-manager/gi;
	newString = new String ("Web&nbsp;Manager")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/content-provider/gi);

	if (inThere1) {
	rExp = /content-provider/gi;
	newString = new String ("Content&nbsp;Provider")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	

	var inThere1 = h.match(/document-mgr-or-librarian/gi);

	if (inThere1) {
	rExp = /document-mgr-or-librarian/gi;
	newString = new String ("Document&nbsp;Manager&nbsp;or&nbsp;Librarian")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/application-developer/gi);

	if (inThere1) {
	rExp = /application-developer/gi;
	newString = new String ("Application&nbsp;Developer")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/web-mod-project-team/gi);

	if (inThere1) {
	rExp = /web-mod-project-team/gi;
	newString = new String ("Web&nbsp;Modernization&nbsp;Project&nbsp;Team")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/eauthentication/gi);

	if (inThere1) {
	rExp = /eauthentication/gi;
	newString = new String ("eAuthentication")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/filenet-document-repository/gi);

	if (inThere1) {
	rExp = /filenet-document-repository/gi;
	newString = new String ("Filenet&nbsp;Document&nbsp;Repository")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	

	var inThere1 = h.match(/portal-development/gi);

	if (inThere1) {
	rExp = /portal-development/gi;
	newString = new String ("Portal&nbsp;Development")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/training/gi);

	if (inThere1) {
	rExp = /training/gi;
	newString = new String ("Web&nbsp;Modernization&nbsp;Training")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
	
	var inThere1 = h.match(/content-management-system/gi);

	if (inThere1) {
	rExp = /content-management-system/gi;
	newString = new String ("Content&nbsp;Management&nbsp;System")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one	
	
	var inThere1 = h.match(/eauthentication-faqs/gi);

	if (inThere1) {
	rExp = /eauthentication-faqs/gi;
	newString = new String ("eAuthentication&nbsp;FAQs")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one		
			
	var inThere1 = h.match(/_/gi);
	
	if (inThere1) {
	rExp = /_/gi;
	newString = new String ("&nbsp;")
	} else {
	rExp = / /gi;
	newString = new String (" ")
	}

	h = h.replace(rExp, newString) //replacing old string with the new one
	
	
//	var inThere1 = h.match(/egov/gi);

//	if (inThere1) {
//	rExp = /egov/gi;
//	newString = new String ("Home")
//	} else {
//	rExp = / /gi;
//	newString = new String (" ")
//	}
//
//	h = h.replace(rExp, newString) //replacing old string with the new one

//	var newstr1 = h.substring(h.indexOf('>')+1);
//	var newstr2 = newstr1.substring(0,4);

	h=h.replace(/>egov/,">Home");  //By Jaya
	
	
	return h
}



//Following functions are utility functions added on 04/07/2005
function SearchAll()
{
 if (document.query.dom1.checked == true){
	document.query.dom0.value = "www.usda.gov fas.usda.gov rma.usda.gov fsis.usda.gov fs.fed.us nrcs.usda.gov rurdev.usda.gov fns.usda.gov ams.usda.gov aphis.usda.gov ars.usda.gov reeusda.gov ers.usda.gov nalusda.gov ocio.usda.gov nad.usda.gov ag.gov ezec.gov foodsafetyjobs.gov jifsr.gov nutrition.gov cnpp.usda.gov usda.gov/gipsa www.egov.usda.gov";}
 else{
	document.query.dom0.value ="www.egov.usda.gov";}
}

function audshow(str)
{
top.location=str;
}