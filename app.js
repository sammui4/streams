/*
 * @Author: w
 * @Date: 2019-08-15 09:26:08
 * @LastEditors: w
 * @LastEditTime: 2019-08-15 16:47:35
 */
var fs = require('fs');
var request = require('request');
var path = require('path');
var os = require('os');

function downloadFile(uri, filename, callback) {

  var requests = request.get(uri)
  requests.on('error', (err) => { })
  // 移动方案
  // requests.on('response', function(response) {
  //   let dir = fs.mkdtempSync(path.join(__dirname,'upgrade_'));
  //   let paths = path.join(dir,filename);
  //   requests.pipe(fs.createWriteStream(paths)).on('close',()=>{
  //     var newPath = path.join(__dirname,filename)
  //     // 移动方案
  //     fs.rename(paths, newPath,(err)=>{
  //       console.log(err);
  //       fs.rmdir(dir,(err )=>{
  //         if(err){
  //           console.log(err);
  //           return
  //         }
  //         callback()
  //       });
  //     });

  //   })
  // })

  // 复制方案
  requests.on('response', function (response) {
    // let temp = path.join(__dirname, 'upgrade_');
    let temp = os.tmpdir();
    let dir = fs.mkdtempSync(temp);
    let paths = path.join(dir, filename);
    requests.pipe(fs.createWriteStream(paths)).on('close', () => {
      var newPath = path.join(__dirname, filename)
      fs.copyFile(paths, newPath, (err) => {
        removeDir(dir);
      });

    })
  })
}

var fileUrl = 'http://localhost:888/client/win-unpacked/resources/app.asar';
var filename = 'app.asar';

downloadFile(fileUrl, filename, () => {
  console.log('下载完毕');
})

// promise 先序深度优先
function removeDir(p) {
  return new Promise((resolve, reject) => { //返回一个promise对象   
    fs.stat(p, (err, statObj) => { // 异步读取文件判断文件类型 是目录 递归 否则就删除即可
      if (statObj.isDirectory()) {
        fs.readdir(p, function (err, dirs) { //读取p下面的文件
          // 映射路径
          dirs = dirs.map(dir => path.join(p, dir));
          // 映射promise
          dirs = dirs.map(dir => removeDir(dir)); // 递归调用，p下面的文件再次调用判断删除方法
          // 删除完儿子后 删除自己
          Promise.all(dirs).then(() => {
            fs.rmdir(p, resolve);
          });
        });
      } else {
        fs.unlink(p, resolve);
      }

    })
  })

}