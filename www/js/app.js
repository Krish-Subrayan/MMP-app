var pictureSource;   // picture source
var destinationType; // sets the format of returned value
 
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() { 
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	var ref = cordova.InAppBrowser.open('index_loading.html', '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);

         document.addEventListener("offline", onOffline, false);
         document.addEventListener("online", onOnline, false);

         get_ver();
         document.addEventListener("backbutton",backButton, false);
        checkConnection();

}

function get_ver(){
var version = 1.2;
$.ajax({
	url:'https://yktohmmp.com/webservice/get_app_ver.php',
	method:'post',
	data:{ver:version},
	success:function(data){  
		//alert(data); 
	},
	error:function(){

		console.log('failed');
	}
	
	});

}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    if(states[networkState] != 'No network connection'){ 
	var ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);
    } else{

    alert(states[networkState]);
   }
}

function backButton(){
	        ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
	        ref.addEventListener("loadstart", urlChanged);
}

function onOffline() { 
  	var ref = cordova.InAppBrowser.open('no_internet.html', '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);
}




function onOnline() {
	var ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);
}



function urlChanged(event) { 
	url = event.url;
	var res = url.split("/"); 

	if(jQuery.inArray("job-details", res) != -1) {
	  var job = getParameterByName('job'); 
	  localStorage.setItem("nice_click_id",job); 
	}

	if(jQuery.inArray("scan", res) != -1 || jQuery.inArray("scan2", res) != -1) { //alert(url); alert( localStorage.getItem("rescan"));

		var job    = getParameterByName('job'); 
		var action = getParameterByName('action'); 
		var status = getParameterByName('status'); 

              
              /*if(localStorage.getItem("rescan")== 'yes' && localStorage.getItem("rescan_act")== 'sc'){ //alert('inside come');

			job = localStorage.getItem("rescan_needed_job");
			status = localStorage.getItem("rescan_needed_status");
			action = localStorage.getItem("rescan_needed_action");
			localStorage.setItem("rescan","no")
			if(status == 'null')
			    status = null;
              }*/


		localStorage.setItem("rescan_needed_job",job)
		localStorage.setItem("rescan_needed_status",status)
		localStorage.setItem("rescan_needed_action",action)
		scan(action,job,status);

	var ref = cordova.InAppBrowser.open('progress.html', '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);	

  } 


	if(url == "https://yktohmmp.com/tablet/?photo=1300") {

	  cameraTakePicture('after');

	}

	if(url == "https://yktohmmp.com/tablet/?submit-photo=1300") {

	  cameraTakePicture('request');

	}


	if(url == "https://yktohmmp.com/tablet/?photo_before=1300") {

	  cameraTakePicture('before');

	}



	if(url == "https://yktohmmp.com/tablet/?rescan=1300") {

          var job    = localStorage.getItem("rescan_needed_job");
          var action = localStorage.getItem("rescan_needed_action");
          var status = localStorage.getItem("rescan_needed_status");
          if(status == 'null')
            status = null;


            scan(action,job,status); //alert(action); alert(typeof status);
	    var ref = cordova.InAppBrowser.open('progress.html', '_blank', 'location=no');
	    ref.addEventListener("loadstart", urlChanged);	

	}
}


function clearCache() {
    navigator.camera.cleanup();
}
 
var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        clearCache();
        retries = 0;



	localStorage.setItem("rresponse",r.response)

        var decide = localStorage.getItem("type_upload");
        var re_url = "https://yktohmmp.com/tablet/"; //https://yktohmmp.com/tablet/reports/?job=Test4


        if(decide == 'before') {
        
          re_url = "https://yktohmmp.com/tablet/upload-photos/?job="+localStorage.getItem("nice_click_id")+"&is_uploaded=yes";

	} 
        if(decide == 'after') {

	re_url = "https://yktohmmp.com/tablet/reports/?job="+localStorage.getItem("nice_click_id");
	}

        if(decide == 'request') {

	re_url = "https://yktohmmp.com/tablet/parts-request/?job="+localStorage.getItem("nice_click_id");
        }



	var ref = cordova.InAppBrowser.open(re_url, '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);	

        
    }
 
    var fail = function (error) {

        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens!');
        }
    }
 
//alert(localStorage.getItem("type_upload"));

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    var params = {}; // if we need to send parameters to the server request
    params.nice_id = localStorage.getItem("nice_click_id");
    params.type_ot = localStorage.getItem("type_upload");
    params.value2 = "param";
    options.httpMethod="POST";
    options.chunkedMode = false;
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("http://yktohmmp.com/webservice/get_taken_report_image.php"), win, fail, options);
}


function cameraTakePicture(typee) {    
    localStorage.setItem("type_upload",typee);
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 100,
        destinationType:  Camera.DestinationType.FILE_URI,
        correctOrientation:false
    });
	var ref = cordova.InAppBrowser.open('photo_progess.html', '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);	
        

}

function onFail(message) {
        var decide = localStorage.getItem("type_upload");
        var par = localStorage.getItem("type_par");

        var re_url = "https://yktohmmp.com/tablet/"; //https://yktohmmp.com/tablet/reports/?job=Test4
        if(decide == 'before')
          re_url = "https://yktohmmp.com/tablet/upload-photos/?job="+localStorage.getItem("nice_click_id");
        if(decide == 'after' ) 
   	  re_url = "https://yktohmmp.com/tablet/reports/?job="+localStorage.getItem("nice_click_id");
        if(decide == 'request') 
 	  re_url = "https://yktohmmp.com/tablet/parts-request/?job="+localStorage.getItem("nice_click_id");

	var ref = cordova.InAppBrowser.open(re_url, '_blank', 'location=no');
	ref.addEventListener("loadstart", urlChanged);	

}
function getParameterByName(name) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function scan(action,job_id,status){ 
        var failed_page = 'qr_failed.html?jobid='+job_id;
        cordova.plugins.barcodeScanner.scan(
                    function (result) { 
                        if(!result.cancelled)
                        {
                            if(result.format == "QR_CODE")
                            {
                                  var value = result.text;
                                  localStorage.setItem('QRscannedvalue',value);
			          var failed_page = 'qr_failed.html?jobid='+job_id+'&qrcode='+value; 
			 	  if(action == 'in' )
				    { 
					$.ajax({
					url:'https://yktohmmp.com/webservice/get_qr.php',
					method:'post',
					data:{job_nice_id:job_id,action_type:action,qr_code:value},
					success:function(data){  
						
					   if(data == 'Scanned In'){
						localStorage.setItem("nice_click_id",job_id);
						var urll = "https://yktohmmp.com/tablet/upload-photos/?job="+job_id;
						//var urll = "upload_photos.html";
                                                alert("Success! QR Code matched. Redirecting..");
						ref = cordova.InAppBrowser.open(urll, '_blank', 'location=no');
						ref.addEventListener("loadstart", urlChanged);
						//window.location.href=urll;
						
					    } 

					   else if (data == 'Scanned In Uploaded'){ 
                                                ref = cordova.InAppBrowser.open("https://yktohmmp.com/tablet/", '_blank', 'location=no');
						ref.addEventListener("loadstart", urlChanged);	
				             }


					 else { 
                                                ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
						ref.addEventListener("loadstart", urlChanged);	
				             }
					},
					error:function() {
				
						ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
						ref.addEventListener("loadstart", urlChanged);	

					}
				  });


                                 } /* Work like diamond */


              if(action == 'out' && status != null  ){  //alert('how');
				$.ajax({ 
				url:'https://yktohmmp.com/webservice/set_none_complete.php',
				method:'post',
				data:{job_nice_id:job_id,action_type:action,qr_code:value},
				success:function(data){ 

					if(data == 'Wrong Equipment'){
						localStorage.setItem("rescan","yes")
						localStorage.setItem("rescan_needed_job",job_id)
						localStorage.setItem("rescan_needed_action",action)
						ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
						ref.addEventListener("loadstart", urlChanged);	

					}
					else{
						alert(data);
						ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
						ref.addEventListener("loadstart", urlChanged);	
					}

				},
				error:function() {

					ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
					ref.addEventListener("loadstart", urlChanged);	
				}


				});
		}

 	if(action == 'non_complete'){ //alert('how 2');
		$.ajax({
			url:'https://yktohmmp.com/webservice/set_scanout.php',
			method:'post',
			data:{job_nice_id:job_id,action_type:action,qr_code:value},
			success:function(data){  

                                if(data != 'Wrong Equipment')
		                 redirection_pass(job_id);	
                                else {
					
	                        ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
				ref.addEventListener("loadstart", urlChanged);	

                              } 
		},

		error:function() {

			ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
			ref.addEventListener("loadstart", urlChanged);	
		}


		});

          }
         

 	if(action == 'non_complete_sc'){ //alert('how 3');
		$.ajax({ 
			url:'https://yktohmmp.com/webservice/set_nc_scanout.php',
			method:'post',
			data:{job_nice_id:job_id,action_type:action,qr_code:value},
			success:function(data){  


	                        ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
				ref.addEventListener("loadstart", urlChanged);	


		},
		error:function() {

			ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
			ref.addEventListener("loadstart", urlChanged);	
		}


		});

          }

 	if(action == 'out' && status == null){  //alert('how 4'); 
		$.ajax({
			url:'https://yktohmmp.com/webservice/set_scanout.php',
			method:'post',
			data:{job_nice_id:job_id,action_type:action,qr_code:value},
			success:function(data){  


			 if(data == 'Wrong Equipment'){ 
					localStorage.setItem("rescan","yes")
					localStorage.setItem("rescan_act","sc")
			                localStorage.setItem("rescan_needed_job",job_id)
					localStorage.setItem("rescan_needed_action",action)
 

	                        ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
				ref.addEventListener("loadstart", urlChanged);	

                                } 
                                else{
                                alert(data);
	                        ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
				ref.addEventListener("loadstart", urlChanged);	

                                } //if(data == 'Scanned Out')

		},
		error:function() {

			ref = cordova.InAppBrowser.open(failed_page, '_blank', 'location=no');
			ref.addEventListener("loadstart", urlChanged);	
		}


		});

                                 }

                          }
                            else {

	                        ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
				ref.addEventListener("loadstart", urlChanged);	

                            }
                        } 
			else {
				//alert('Cancelled');

	                        ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
				ref.addEventListener("loadstart", urlChanged);	

                            }
                    },
                    function (error) {

	                        ref = cordova.InAppBrowser.open('https://yktohmmp.com', '_blank', 'location=no');
				ref.addEventListener("loadstart", urlChanged);	

    }
               );
            }




function pass_to_job(){ //alert('job_re');//alert(id);

 		  localStorage.setItem("nice_click_id",id);
		  var urll = "https://yktohmmp.com/tablet/job-details/?job="+id; 
		  ref = cordova.InAppBrowser.open(urll, '_blank', 'location=no');
		  ref.addEventListener("loadstart", urlChanged);
		  //alert(urll);
}



function redirection_pass(id){ 

		  var urll = "https://yktohmmp.com/tablet/job-details/?job="+id; 
		  ref = cordova.InAppBrowser.open(urll, '_blank', 'location=no');
		  ref.addEventListener("loadstart", urlChanged);


}


function none_complete(action,id){

var nice_id = localStorage.getItem("nice_click_id");
$.ajax({
	  url:'http://yktohmmp.com/webservice/set_none_complete.php',
	  method:'post',
	  data:{id:id},
          success:function(data){
		 scan(action,nice_id);
		 
	 }, 
	  error:function(data){ 
           alert('failed to fetch data');
        }
   });

}










