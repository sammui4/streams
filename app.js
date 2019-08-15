/*
 * @Author: w
 * @Date: 2019-08-15 09:26:08
 * @LastEditors: w
 * @LastEditTime: 2019-08-15 15:34:07
 */
var fs = require('fs');
var request = require('request');
var path = require('path');

function downloadFile(uri,filename,callback){

  var requests = request.get(uri)
  requests.on('error',(err)=>{
  })
  requests.on('response', function(response) {
    let dir = fs.mkdtempSync(path.join(__dirname,'upgrade_'));
    let paths = path.join(dir,filename);
    requests.pipe(fs.createWriteStream(paths)).on('close',()=>{
      fs.rename(paths, path.join(__dirname,filename),function(){
        fs.rmdir(dir,(err )=>{
          if(err){
            return
          }
          callback()
        });
      });
    })
  })
}

var fileUrl  = 'http://localhost:888/client/win-unpacked/resources/app.asar';
var filename = 'app.asar';

downloadFile(fileUrl,filename,()=>{
  console.log('下载完毕');
})
