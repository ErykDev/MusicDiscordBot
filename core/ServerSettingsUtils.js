const fs = require('fs');
const path = require('path');
var CircularJSON = require('circular-json');

module.exports = class ServerSettingsUtils{

  static setServerDJRanks(message, Options, value){
    Options.ServerDJRanks = value;//agrs[2];
    message.reply(" server dj has changed :) \n don't forget to apply changes");
  }
  static setServerprefix(message, Options, value){
    Options.Serverprefix = value
    message.reply(" server prefix has changed :) \n don't forget to apply changes");
  }
  static setServerCleanerRank(message, Options, value){
    Options.ServerCleanerRank = value;
    message.reply(" server cleaner rank has changed :) \n don't forget to apply changes");
  }
  static setServerPlayerRanks(message, Options, value){
    Options.ServerPlayerRanks = value;
    message.reply(" server player rank has changed :) \n don't forget to apply changes");
  }


  static createServerSettingsIfNecessary(Servers = [], guildID){
    if (!Servers[guildID]) {
        Servers[guildID] = {
            Serverprefix: "",
            ServerCleanerRank: "",
            ServerPlayerRanks: "",
            ServerDJRanks: ""
        };
    }
  }

  static saveOptions(Options, guildID){
  //  serversOptions[message.guild.id]
    fs.writeFile("./ServersExtraOptions/" + guildID + ".json", CircularJSON.stringify(Options, null, 2), "utf8", function (err) {
        if (err) {
            console.log("err while saving servers data :(");
        } else
            console.log("all set.");
    });
  }

  static loadSettings(){
    var res = new Array();

    function readFiles(dir, processFile) {
      // read directory
    fs.readdir(dir, (error, fileNames) => {
    if (error) throw error;
    fileNames.forEach(filename => {
      // get current file name
      const name = path.parse(filename).name;
      // get current file extension
      const ext = path.parse(filename).ext;
      // get current file path
      const filepath = path.resolve(dir, filename);
      // get information about the file
      fs.stat(filepath, function(error, stat) {
        if (error) throw error;
        // check if the current path is a file or a folder
        const isFile = stat.isFile();
        // exclude folders
        if (isFile) {
          // callback, do something with the file
          processFile(filepath, name, ext, stat);
        }
        });
      });
    });
  }

  readFiles('../ServersExtraOptions/', (filepath, name, ext, stat) => {
    console.log('file name:', name);
      if (ext == "json" || ext == ".json") {
        res.push(JSON.parse(fs.readFileSync(filepath, 'utf-8')));
      }
  });

  return res;
  }

}
