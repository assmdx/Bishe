function onLoad() {			
	    document.addEventListener("deviceready",onDeviceReady, false);
	    //console.log("onload正确启动");   	    
	}

// 设备API可以使用了
//
function onDeviceReady() {
    // document.addEventListener("pause", onPause, false);
    // document.addEventListener("resume", onResume, false);
    // document.addEventListener("menubutton", onMenuKeyDown, false);
    //给其他事件添加类似的监听
    // window.location.href="login.html";//?????????????????
    // document.getElementById('a1').innerHTML=cordova.file.dataDirectory;
    // alert(cordova.file.dataDirectory);
    //document.getElementById('a1').innerHTML=device.platform;
    // console.log("1213678263");    
    //createFileDirectory();          
	//debugIt(); 	
	// addClientSyncCode(1,function(ClientSyncCode){
	//   		//console.log('获取本地clientSyncCode=='+ClientSyncCode);
	//   		ocfw('获取本地clientSyncCode=='+ClientSyncCode);
	// });	
	Sync(2);
	// getFilelist(cordova.file.dataDirectory);
}

function onPause() {
    //处理暂停事件
}

function onResume() {
    //处理恢复事件
}

function onMenuKeyDown() {
    //处理"菜单"按钮事件
}

// 给其他事件添加类似的事件处理
function debugIt(){
	var thisdevice = device.platform;
	var filepath;
    if(thisdevice == "Android") {		    	
		filepath ="file:///storage/emulated/999/storage/emulated/0/FileForStudycordova/sf/app.apk";	
	}     
	if(thisdevice == "windows") {		    					
	    filepath = cordova.file.dataDirectory;
	}	
	//upload(filepath,uploadUrl);
	//download(filepath,serverFileIp+"/sf/app.apk");
	// console.log(getServerFileDate(getLastModifiedUrl,filepath));
	var stime = getServerFileDate(getLastModifiedUrl,filepath);
	console.log("文件修改时间"+stime);

}
function createFile(choose){
	var filedir = document.getElementById("NewDirName").value;
	var filename = document.getElementById("NewFileName").value;
	var folders = "FileForStudycordova/"+filedir+"/";
	if(choose == 2){			
		var para=document.createElement("p");
	    var node=document.createTextNode("要创建的文件目录路径:"+folders);
	    para.appendChild(node);
	    var element=document.getElementById("newBuildFileDirectory");
	    element.appendChild(para);	
		createFileDirectory(1,folders,1,null);		
	}
	if(choose == 1) {
		var para=document.createElement("p");
	    var node=document.createTextNode("要创建的文件路径:"+folders+filename);
	    para.appendChild(node);
	    var element=document.getElementById("newBuildFile");
	    element.appendChild(para);	
		createFileDirectory(1,folders,0,filename);			
	}
	if(choose == 3){
		var para=document.createElement("p");
	    var node=document.createTextNode("要查看的文件路径:"+folders+filename);
	    para.appendChild(node);
	    var element=document.getElementById("newBuildFF");
	    element.appendChild(para);	
		var ttime;
		createFileDirectory(1,folders,2,filename,function(ime){
			ttime = ime;
			console.log(ttime);
			var para1=document.createElement("p");
		    var node1=document.createTextNode(folders+filename+"最新修改时间:"+ttime);
		    para1.appendChild(node1);	    
		    element.appendChild(para1);
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
