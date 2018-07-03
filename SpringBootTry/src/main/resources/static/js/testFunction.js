
function doTestGet(){
	var xhr = XHR();
	xhr.open("GET","/e?name=wwl",true);
	xhr.send(null);
	xhr.onreadystatechange = function () {
 		if (xhr.readyState==4 && xhr.status ==200) {
 			alert(xhr.responseText);
 		}
 	};
}


function doTestPost(){
	var xhr = XHR();
	xhr.open("GET","/f",true);
	var jso = {};
	jso.age = 180;
	var str = JSON.stringify(jso);
	xhr.send(str);
	xhr.onreadystatechange = function () {
 		if (xhr.readyState==4 && xhr.status ==200) {
 			alert(xhr.responseText);
 		}
 	};
}

function XHR() {
	var xhr;
	try {
		xhr = new XMLHttpRequest();
	}catch(e) {
		var IEXHRVers =["Msxml3.XMLHTTP","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
		for (var i=0,len=IEXHRVers.length;i< len;i++) {
			try {
				xhr = new ActiveXObject(IEXHRVers[i]);
			}catch(e) {continue;}
		}
	}
	return xhr;
}

