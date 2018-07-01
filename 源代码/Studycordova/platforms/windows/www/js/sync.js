var serverFileIp = "http://192.168.43.223:8888/FileServer/";
var serverIpAddress="http://192.168.43.223:8888/FileServer/server";
var getLastModifiedUrl = serverIpAddress +"/getFileLastModified";
var uploadUrl = serverIpAddress +"/upload";
var getServerTimeURL=serverIpAddress +"/getServerTime";
var getServerFileListURL=serverIpAddress +"/getServerFileList";
var getServerSyncCodeURL=serverIpAddress +"/DealServerSyncCode";
var serverFileIpForDownloadSync = "192.168.43.223:8888/";
//@获取服务器上的synccode,option{0:get,1:add,2:prepare}
function getServerSyncCode(option,callback){
	var xhttp = new XMLHttpRequest();	
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {       
	    	var sd = parseInt(xhttp.responseText);
	    	console.log('接收到的ServerSyncCode='+xhttp.responseText+'option='+option);
	    	callback(sd);
	    }
	};
	if(option==0)
		xhttp.open('GET',getServerSyncCodeURL+"?func=get");
	if(option==1)
		xhttp.open('GET',getServerSyncCodeURL+"?func=add");
	if(option==2)
		xhttp.open('GET',getServerSyncCodeURL+"?func=prepare");
	xhttp.send();
}
//@改变本地ClientSyncCode option{0：创建SyncCode，1:读取SyncCode，2:SyncCode++,其他:写入SyncCode(option)}
function addClientSyncCode(option,callback2){
	var thisdevice = device.platform;
	if(thisdevice == "windows") {				
		window.requestFileSystem(window.PERSISTENT, 1024*1024,onInitFs, errorHandler);  	
	}
	if(thisdevice == "Android") {		
		window.requestFileSystem(LocalFileSystem.PERSISTENT,1024*1024,onInitFs,errorHandler);			
	}
	function onInitFs(fs) {  	  
		fs.root.getFile('ClientSyncCode.txt',{  
        	create: true,  
        	exclusive: false  
    		},function(fileEntry){
    			//?????????
    			if(option==0){
    				writeFile(fileEntry,"0");
    				callback2(0);
    			}
    			if(option ==1){
    				readFile(fileEntry,function(ss){
    					// console.log("ClientSyncCode=:"+ss);
    					if(ss){
    						var ssInt =parseInt(ss);
    						callback2(ss);    						
    					}
    					else
    						writeFile(fileEntry,"0");    					
    				});    				
    			}
    			if(option ==2){    				
    				readFile(fileEntry,function(ss){
    					console.log("ClientSyncCode=:"+ss);
    					if(ss){
    						var ssInt =parseInt(ss);
    						ssInt++;    						   					
    						writeFile(fileEntry,ssInt);
    						callback2(ssInt); 
    					}
    					else
    						writeFile(fileEntry,"0");     				
    				});
    			}
    			if(option>2){
    				readFile(fileEntry,function(ss){
    					console.log("ClientSyncCode=:"+ss);
    					if(ss){    						   						   				
    						writeFile(fileEntry,option);
    						callback2(option); 
    					}
    					else
    						writeFile(fileEntry,option);     				
    				});
    			}
    		}
    	);
	}  
	function errorHandler(err){		
		console.log(err);
	}
}
// @获取服务器文件列表，默认不获取文件夹，只获取文件
function getServerFileList(callback){
	var xhttp = new XMLHttpRequest();	
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {       
	    	var obj = eval ("(" + xhttp.responseText + ")");
	    	callback(obj);
	    }
	};	
	xhttp.open('GET',getServerFileListURL);	
	xhttp.send();
}
//@同步,option{1:Client -> server,2:server->client,3:<->}
function Sync(option){//callback????
	addClientSyncCode(1,function(ClientSyncCode){//获取ClientSyncCode
		console.log('获取本地clientSyncCode=='+ClientSyncCode);
		getServerSyncCode(0,function(ServerSyncCode){//获取服务器ServrSyncCode						
			if((option == 1&&ServerSyncCode>ClientSyncCode)||(option==2&&ServerSyncCode<=ClientSyncCode)){
				// callback(null);						
			}
			if((option == 1 && ServerSyncCode<=ClientSyncCode)||(option == 3 && ServerSyncCode<=ClientSyncCode)){
				// upload ..	
				getServerSyncCode(2,function(s1){/*先让服务器做好准备工作*/
					addClientSyncCode(2,function(r1){});
					getServerSyncCode(1,function(ss1){});
			    	var thisdevice = device.platform;
					if(thisdevice == "windows") {				
						window.requestFileSystem(window.PERSISTENT, 1024*1024,beforeonInitFs, errorHandler);  	
					}
					if(thisdevice == "Android") {		
						window.requestFileSystem(LocalFileSystem.PERSISTENT,1024*1024,beforeonInitFs,errorHandler);			
					}
					function toArray(list) {  
					  return Array.prototype.slice.call(list || [], 0);  
					}  	  				 
					function beforeonInitFs(fs){
						onInitFs(fs.root);
					}
					function onInitFs(ks) {  	  
						var dirReader = ks.createReader();  
						var entries = [];  					 	   
						dirReader.readEntries (function(results) { 						
							if (!results.length) {} 
							else {  
								entries = entries.concat(toArray(results));  							 
								results.forEach(function(entryy, i) {  	     
									if(entryy.isDirectory)	{					
										onInitFs(entryy);
									}
									else{
										var fileURL = entryy.toURL();
										// console.log('Sync上传文件'+fileURL);
										if(entryy.name =="ClientSyncCode.txt"&&entryy.fullPath=="/ClientSyncCode.txt"){																	
										}
										else{
											upload(fileURL,serverIpAddress+"/upload","text/html");								
										}									
									}								
								});										
							}  			
						}, function(err){
							console.log(err);			
						});  	
						//readEntries(); // Start reading dirs. 		
					}  
					function errorHandler(err){		
						console.log(err);
					}
				});				
			}
			if((option == 2 && ServerSyncCode>ClientSyncCode)||(option == 3 && ServerSyncCode>ClientSyncCode)){		
				// download ..						
				addClientSyncCode(ServerSyncCode,function(r){});//???????????????					
				getServerFileList(function(obj){
					removeFiles();//????????????????????????????????
					for(var i = 0; i < obj.length ; i++) {
						var fileURL = dealpath(obj[i]);												
						download(fileURL,serverFileIpForDownloadSync+obj[i]);//同步失败了怎么办??????
					}
					//ocfw('同步成功');										
				});
				// callback('ok');
			}
		});
	});	    
    function toArray(list) {  
	        return Array.prototype.slice.call(list || [], 0);  
    }
    //得到本地fileURL
    function dealpath(path){
    	return cordova.file.dataDirectory +"/" +path;
    }			 
}
