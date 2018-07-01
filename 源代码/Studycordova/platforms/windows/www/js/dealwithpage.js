
// @前端页面DOM操作，与本地操作
// @For index.html
function onLoad(){        
	document.addEventListener("deviceready",onDeviceReady, false);          
}
function onLoad2(){
	document.addEventListener("deviceready",onDeviceReady2, false);          
}
// @针对windows修改服务器网址
function onDeviceReady() {  
	if(device.platform=="windows"){
		serverFileIp = "http://127.0.0.1:8888/FileServer/";
 		serverIpAddress="http://127.0.0.1:8888/FileServer/server";
 		getLastModifiedUrl = serverIpAddress +"/getFileLastModified";
 		uploadUrl = serverIpAddress +"/upload";
 		getServerTimeURL=serverIpAddress +"/getServerTime";
 		getServerFileListURL=serverIpAddress +"/getServerFileList";
 		getServerSyncCodeURL=serverIpAddress +"/DealServerSyncCode";
 		serverFileIpForDownloadSync = "http://127.0.0.1:8888/";
	}
	if(device.platform=="Android")  {

	}
}
function onDeviceReady2() {  
	getsyncfilelist(sfiledir);
}
// @For backup.html
function changePageState(){
	document.getElementById('BackupBT1').style.display = 'none';
	document.getElementById('BackupBT2').style.display = '';
	document.getElementById('BackupXX').style.display = 'none';        
	document.getElementById('ShowBackup').style.display = '';    	  
}
function gotomainpage(){
	window.location.href="mainpage.html";
}
function startbackup(){
	if(document.getElementById("normalbuc").checked)
		backup();
	if(document.getElementById("cryptbuc").checked)
		zipbackup(1);
	if(document.getElementById("zipbuc").checked)
		zipbackup(0);
}
function backupcheckboxstate(s){
	document.getElementById("normalbuc").checked=false;
	document.getElementById("cryptbuc").checked=false;
	document.getElementById("zipbuc").checked=false;
	document.getElementById(s).checked=true;
}
//dirpath的格式:a/b/x/
function getbackupfilelist(){	

	getFilelist2('Backup'.split('/'),function(obj){
		for(var i = 0; i < obj.length ; i++) {
			getDirDom(obj[i].name,0,function(s){
				document.getElementById("Backupfilelist").appendChild(s);
			});
		}
	});
}
// @For mainpage.html

//dirpath的格式:a/b/x/
function getsyncfilelist(dirpath){        
	//清空?????
	console.log(dirpath);
	getFilelist2(dirpath.split('/'),function(obj){
		for(var i = 0; i < obj.length ; i++) {
			if(obj[i].isFile){
				getDirDom(obj[i].name,2,function(s){
					if(device.platform=='windows'){
						var ii = document.getElementById("syncFilelist").innerHTML;
						document.getElementById("syncFilelist").innerHTML = ii + window.toStaticHTML(s);
					}
					else
						document.getElementById("syncFilelist").appendChild(s);
				});
			}
			if(obj[i].isDirectory){
				getDirDom(obj[i].name,1,function(s){
					if(device.platform=='windows'){
						var ii = document.getElementById("syncFilelist").innerHTML;
						document.getElementById("syncFilelist").innerHTML = ii + window.toStaticHTML(s);						
					}
					else
						document.getElementById("syncFilelist").appendChild(s);
				});
			}			
		}
	});
}
function syncdirclicked(s){
	//清空
	document.getElementById("syncFilelist").innerHTML="";
	//生成新的dirpath
	sfiledir = sfiledir + '/' + s.innerHTML;	
	//调用..
	getsyncfilelist(sfiledir);
}
// @For ALL

//option{0:backupfile,1:filedir,2:file}
function getDirDom(name,option,callback){
	if(option==0){
		var li = document.createElement("li");
		var a = document.createElement("a");		
		a.innerHTML ="&nbsp;&nbsp;<i class=\"am-icon-file-archive-o\"></i> &nbsp;&nbsp;<span onclick=\"syncdirclicked(this)\">"+name+"</span>";
		li.appendChild(a);
		callback(li);		
	}
	if(option==1){
		var li = document.createElement("li");
		var a = document.createElement("a");		
		a.innerHTML ="&nbsp;&nbsp;<i class=\"am-icon-folder\"></i> &nbsp;&nbsp;<span onclick=\"syncdirclicked(this)\">"+name+"</span>"; 
		li.appendChild(a);
		callback(li);
	}
	if(option==2){
		var li = document.createElement("li");
		var a = document.createElement("a");		
		a.innerHTML ="&nbsp;&nbsp;<i class=\"am-icon-file\"></i> &nbsp;&nbsp;"+name;
		li.appendChild(a);
		callback(li);		
	}
}
