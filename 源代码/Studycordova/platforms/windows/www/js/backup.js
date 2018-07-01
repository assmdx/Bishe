// @备份
//需要引用sha256.js
function backup(){
	var thisdevice = device.platform;
	if(thisdevice == "windows") {		 
		window.requestFileSystem(window.PERSISTENT, 1024 * 1024,onInitFs);		
	}
	if(thisdevice == "Android") {		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024,onInitFs);			
	}			
	function onInitFs(fs) {  
		fs.root.getDirectory(
			"FileForStudycordova", {create: true},function(dirEntry){//
				if(thisdevice == "windows") {		 
					window.requestFileSystem(window.PERSISTENT, 1024 * 1024,deal);		
				}
				if(thisdevice == "Android") {		
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024,deal);			
				}
				function deal(ff){
					ff.root.getDirectory(
						"Backup",{create:true},function(dirEntry2){
							addClientSyncCode(1,function(code){
								dirEntry2.getDirectory(
									code,{create:true},function(r1){
										dirEntry.copyTo(r1,"FileForStudycordova",function(r2){
											console.log('备份成功');
											if(thisdevice == "windows"){
												ocfw('备份成功');
											}
										});
									}
								);
							});
						}
					);		
				}
			}
		);   
	}
}
// @压缩备份option{0:压缩备份，1：加密备份}
function zipbackup(option){
	var zip = new JSZip();
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
		setTimeout(function(){
			zip.generateAsync({type:"base64"})
			.then(function (blob) {
			    // saveAs(blob, "hello.zip");
			    fs.root.getDirectory("Backup",{create:true},function(dir){
			    	addClientSyncCode(1,function(Clientsynccode){ 
			    		if(option==0){
			    			dir.getFile(Clientsynccode+".zip",{create:true},function(ff){				    			
				    				writeFile(ff,blob);				    			
				    		});
			    		}
			    		if(option==1){
			    			dir.getFile(Clientsynccode+"Crypto.zip",{create:true},function(ff){				    			
			    				cryptoString(blob,function(s){
			    					writeFile(ff,s);
			    				});				    			
				    		});
			    		}			    		
			    	});			    	
			    });
			});
		},1000);//等待读取文件完成	
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
						zip.folder(entryy.toURL());//????????????????????				
						onInitFs(entryy);
					}
					else{						
						entryy.file(function(fil){
							var reader = new FileReader();
							reader.onloadend=function(){
								zip.file(entryy.toURL(),this.result);//?????????????
							};
							reader.readAsArrayBuffer(fil); 
						});						
					}								
				});										
			}  			
		}, function(err){
			console.log(err);			
		});				 	
	}  
	function errorHandler(err){		
		console.log(err);
	}
}
//字符串sha256加密函数
function cryptoString(str,callback){
	var hash = CryptoJS.HmacSHA256(str, "rzc");
	callback(hash);
}