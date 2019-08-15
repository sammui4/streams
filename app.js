/*
 * @Author: w
 * @Date: 2019-08-15 09:26:08
 * @LastEditors: w
 * @LastEditTime: 2019-08-15 14:30:36
 */
var fs = require('fs');
var request = require('request');
var path = require('path');

function downloadFile(uri,filename,callback){

  var requests = request.get(uri)
  requests.on('error',(err)=>{
  })
  requests.on('response', function(response) {
    requests.pipe(fs.createWriteStream(filename)).on('close',callback)
  })
  
}

var fileUrl  = 'http://localhost:888/client/win-unpacked/resources/app.asar';
var filename = 'app.asar';

downloadFile(fileUrl,filename,()=>{
  console.log('下载完毕');
})
