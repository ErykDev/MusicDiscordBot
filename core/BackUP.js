const fs = require("fs");
var CircularJSON = require('circular-json');

module.exports = class BackUP{
  static do(serversData){

    Object.setup = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
                delete obj[key].dispatcher;
                obj[key].isitEnd = false;
                obj[key].isPlaying = false;
            }
        }
        return obj;
    };

    var copy = {};
    var jsonBackupPromise = new Promise(function (resolve, reject) {
        // do a thing, possibly async, then…
        try {
            copy = Object.assign({}, serversData);
        } catch (err) {
            reject(Error("BackUPexecutor.do(serversData) failed"));
        }
        resolve();
    });
    jsonBackupPromise.then(() => {
        fs.writeFile("./memory.json", CircularJSON.stringify(Object.setup(copy), null, 2), "utf8", (err) => {
            if (err) {
                console.log(Error("BackUPexecutor.do(serversData) failed"))
            }
        });
    });
  }

  static load(){
    return CircularJSON.parse(fs.readFileSync('./memory.json', 'utf-8'));
  }
}
