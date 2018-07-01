//@新建文件目录|新建文件|查询文件最新修改时间
//size是目录配额大小，var path = 'music/genres/jazz/' createDir(5,path.split('/')); 
//ans{0:新建文件，1:新建目录，2：获取文件LastModified}
// fs.root is a DirectoryEntry. folders包含FileForStudycordova
function createFileDirectory(size,path,ans,filename,callback){
	var ttime = null;
	var thisdevice = device.platform;
	if(thisdevice == "windows") {
		//创建文件  
		window.requestFileSystem(window.PERSISTENT, size*1024 * 1024,onInitFs);		
	}
	if(thisdevice == "Android") {
		//createFile2();
		window.requestFileSystem(LocalFileSystem.PERSISTENT, size*1024 * 1024,onInitFs);			
	}			
	function onInitFs(fs) {  
	  createDir(fs.root, path.split('/')); // fs.root is a DirectoryEntry.  
	}  	 
	function createDir(rootDirEntry, folders) {  
	  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.  
	  if (folders[0] == '.' || folders[0] == '') {  
	    folders = folders.slice(1);  
	  }  
	  rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {  
	    // Recursively add the new subfolder (if we still have another to create).  
	    
	    var para=document.createElement("p");
	    var node=document.createTextNode("创建"+dirEntry.toURL()+"成功");
	    para.appendChild(node);
	    var element=document.getElementById("newBuildFile");
	    element.appendChild(para);

	    if (folders.length - 2) {  
	      createDir(dirEntry,folders.slice(1));  
	    }  
	    else{
	    	if(ans !=1){
	    			//新建文件???????????????????
	    		dirEntry.getFile(filename,{create:true,exclusive:false},
	    			function(fileeEntry){
	    				if(ans == 0) {
	    					console.log("文件地址:"+fileeEntry.toURL());
	    					writeFile(fileeEntry,"测试获取本地文件LastModified");
	    					callback(null);	    					
	    				}	
	    				if(ans == 2){
	    					fileeEntry.getMetadata(function(rr){	    						
	    						var fflm = rr.modificationTime;	    						
	    						console.log(fflm.getTime());
	    					    ttime = fflm.getTime();
	    					    callback(ttime);//?????????	    						
	    					});
	    				}    				
	    			}
	    		);	
	    	}
	    	else 
	    		callback(null);		    	   
	    }
	  }, errorHandler);  
	}; 
	function errorHandler(err) {  
        console.info(err);          
    }     
	return ttime;//????????????????????????????????????	   
}
	
//@查看指定目录包括其子目录下的所有文件
function getFilelist(FileDirectory){	
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
	// function listResults(entries) {  	  	  	  
	//   entries.forEach(function(entry, i) {  	     
	//     var para=document.createElement("p");
	//     var node=document.createTextNode(entry.toURL());
	//     para.appendChild(node);
	//     var element=document.getElementById("showFileOfDatadirectory");
	//     element.appendChild(para);
	//   });  	  	 
	// }  
	function beforeonInitFs(fs){
		onInitFs(fs.root);
	}
	function onInitFs(ks) {  	  
		var dirReader = ks.createReader();  
		var entries = [];  
		// Call the reader.readEntries() until no more results are returned.  	    
		dirReader.readEntries (function(results) { 
			console.log("当前目录下的条目的个数"+results.length); 
			if (!results.length) {  
				// listResults(entries.sort());  
				// callback(null);
			} 
			else {  
				entries = entries.concat(toArray(results));  				
				results.forEach(function(entryy, i) {  	     
					if(entryy.isDirectory)	{					
						onInitFs(entryy);
					}
					if(device.platform == "windows"){
						var para=document.createElement("p");
					    var node=document.createTextNode(entryy.fullPath);
					    para.appendChild(node);
					    var element=document.getElementById("showFileOfDatadirectory");
					    element.appendChild(para);
					}
					console.log(entryy.fullPath);
				});
				// fforEach(results,0,function(r1){
				// 	callback(r1)
				// });
				// function fforEach(result,i,callba){
				// 	var entryy  = result[i];
				// 	if(entryy.isDirectory)	{					
				// 		onInitFs(entryy,function(ss){
				// 			entries = entries.concat(toArray(ss));	///?????????????
				// 			fforEach(result,i+1,function(r){
				// 				callba(entries);
				// 			});						
				// 		});
				// 	}					
				// 	else{

				// 	}					
				// }				
			}  			
		}, function(err){
			console.log(err);			
		});  	
		//readEntries(); // Start reading dirs. 		
	}  
	function errorHandler(err){		
		console.log(err);
	}	
}
//@查看指定目录下的文件或文件夹
//createDir(fs.root, 'Documents/Images/Nature/Sky/'.split('/'));
//getFilelist2('Documents/Images/Nature/Sky/'.split('/'),function(obj){.....});
function getFilelist2(folders,callback){
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
		findDir(fs.root,folders);
	}
	function findDir(dirEntry,folders){		
		dirEntry.getDirectory(folders[0],{create:true},function(ks){			
			if (folders.slice(1).length) {				  			
	   	 	    findDir(ks, folders.slice(1));
		    }
		    else{
		    	var dirReader = ks.createReader();  
				var entries = [];  			   
				dirReader.readEntries(function(results) { 			
					if (!results.length) {} 
					else {  
						entries = entries.concat(toArray(results));  				
						callback(entries);						
					}  			
				}, function(err){
					console.log(err);			
				});
		    }
		});
	}	  
	function errorHandler(err){		
		console.log(err);
	}	
}
//@上传文件到服务器 
// !! Assumes variable fileURL contains a valid URL to a text file on the device, 
//    for example, cdvfile://localhost/persistent/path/to/file.txt 
function upload(fileURL,serverUploadUrl) {
	var win  = function(r){
		console.log("上传成功");
	}
	var fail = function(error) {
		console.log("上传失败");
		console.log(error);
	}
	var option = new FileUploadOptions();
	option.filekey = "file";// 表单元素的名称。同input标签中的name属性。
	option.chunkedMode = false;
	option.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
	option.mimeType = "text/plain";
	var params = {};	
	//文件名
	params.value1 = fileURL.substr(fileURL.lastIndexOf('/') + 1);
	//文件目录	
	params.value2 = fileURL.substring(fileURL.indexOf("FileForStudycordova"),fileURL.lastIndexOf('/'));//?????????
	option.params = params;
	console.log("上传文件名"+params.value1);	
	console.log("上传文件的路径"+params.value2);
	var ft = new FileTransfer();
	console.log(ft);
	ft.upload(fileURL,encodeURI(serverUploadUrl),win,fail,option,false,
    {
        headers: {
            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" 
        }
    });
}	
//@从服务器下载文件
// !! Assumes variable fileURL contains a valid URL to a path on the device, 
//    for example, cdvfile://localhost/persistent/path/to/downloads/ 
function download(fileURL,serverDownloadUrl) {	
	// var uri = encodeURI("http://some.server.com/download.php");
	var uri = encodeURI(serverDownloadUrl);
	var win  = function(r){
		console.log("下载成功");
	}
	var fail = function(error) {
		console.log("下载失败");
		console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
	}
	var ft = new FileTransfer();
	ft.download(uri,fileURL,win,fail,false,
    {
        headers: {
            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" 
        }
    });	
}
//@获取服务器上的文件最新修改时间
function getServerFileDate(url,fileURL){
	var fileLastMTime = null;
	fileURL = fileURL.substr(fileURL.indexOf("FileForStudycordova"));
	console.log("要获取修改文件修改时间的文件："+fileURL);
	var xhttp = new XMLHttpRequest();
	// xhttp.timeout = 3000;
	// xhttp.ontimeout = function(event){
	// 	console.log("获取文件LastModified请求超时");
	// }	
	xhttp.onreadystatechange = function() {		
		if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			//document.getElementById("demo").innerHTML = xhttp.responseText;	       
			console.log("Success:"+xhttp.responseText);
			console.log("SuccessInt:"+parseInt(xhttp.responseText));
			fileLastMTime= parseInt(xhttp.responseText);//????????????						
		}
	};
	xhttp.open('GET',url+"?fileURL="+fileURL,false);
	xhttp.send();
	return fileLastMTime;
}
// 写入文件
function writeFile(fileEntry, dataObj) {  
    fileEntry.createWriter(function (fileWriter) {  
        //写入结束  
        fileWriter.onwriteend = function () {  
            // console.log('写入文件成功');  
            //读取内容  
            //readFile(fileEntry);  
        }  
        fileWriter.onerror = function (e) {  
            console.log('写入文件失败:' + e.toString());  
        }  
        if (!dataObj) {  
            dataObj = new Blob(['some file data'], { type: 'text/plain' });  
        }  
        fileWriter.write(dataObj);  
    });  
}  
//读取文件内容  
function readFile(fileEntry,callback) {  
    fileEntry.file(function (file) {  
        var reader = new FileReader();  
        reader.onloadend = function () {  
            // console.log('读取文件成功：' + reader.result);  
            callback(reader.result);
            //显示文件  
            console.info(fileEntry.fullPath);  
        }  
        reader.readAsText(file);  
    }, function (err) {  
        console.info('读取文件失败');  
    });  
}
// @删除本地所有文件  
function removeFiles(){
	var thisdevice = device.platform;
	if(thisdevice == "windows") {
		//创建文件  
		window.requestFileSystem(window.PERSISTENT, 1024 * 1024,onInitFs);		
	}
	if(thisdevice == "Android") {
		//createFile2();
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024,onInitFs);			
	}
	function onInitFs(fs) {  
	  	fs.root.getDirectory('FileForStudycordova',{create: true},function(ff){
	  		ff.removeRecursively(function(s){
	  			console.log('删除本地所有文件成功');
	  		});
	  	});
	}
}

function ocfw(r){//OutputConsoleForWindows
	var element=document.getElementById("OutPutForWindows");
	var para1=document.createElement("p");
    var node1=document.createTextNode(r);
    para1.appendChild(node1);	    
    element.appendChild(para1);
}
