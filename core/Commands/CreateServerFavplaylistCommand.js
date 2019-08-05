const Command = require('./Command');
var CircularJSON = require('circular-json');
const QueueUtils = require('../QueueUtils');
const fs = require('fs');
const path = require('path');

module.exports = class CreateServerFavplaylistCommand extends Command{

  CreateServerFavplaylistCommand(ServerControlerRole){
    this.ServerControlerRole = ServerControlerRole;
  }

  execute(message, server, owner){
    super.execute(message, Command.CREATE_SERVER_FAVPLAYLIST());

    if (!(QueueUtils.serverQueueExist(message,server)))
        return;

    var secopy = {};
    var copy = {};

    Object.playlistsetup = (obj) => {
        delete obj.dispatcher;
        obj.isitEnd = false;
        obj.isPlaying = false;

        return obj;
    };
/*
    if (!(ServerControlerRole == null)) {
      if (!(message.author.id === owner || message.member.roles.has(ServerControlerRole))) {
          return;
      }
    }
    if (!server.video.queue[2]) {
        message.reply(" Playlist mean minimal 3 sounds :cold_sweat: ");
        return;
    }
*/
    if (typeof ServerControlerRole === 'undefined') {
      if (!server.video.queue[2]) {
          message.reply(" Playlist mean minimal 3 sounds :cold_sweat: ");
          return;
      }
        createPlaylist();
        return;
    } else if (ServerControlerRole == "" || ServerControlerRole == null) {
      if (!server.video.queue[2]) {
          message.reply(" Playlist mean minimal 3 sounds :cold_sweat: ");
          return;
      }
        createPlaylist();
        return;
    } else if (ServerControlerRole.split(";").some(x => message.member.roles.has(x))) {
      if (!server.video.queue[2]) {
          message.reply(" Playlist mean minimal 3 sounds :cold_sweat: ");
          return;
      }
        createPlaylist();
        return;
    } else {
        message.reply(" you don't have permission :grimacing: ");
    }

    function createPlaylist(){
    Command.logDebug(`Creating Server Playlist { GuildID:${message.guild.id} }`)

    var CrObjectforWrite = new Promise(function (resolve, reject) {
        // do a thing, possibly async, then…
        try {
            copy = Object.assign({}, server);
            secopy = Object.playlistsetup(copy)
            //console.log(CircularJSON.stringify(secopy, null, 2));
        } catch (err) {
            Command.logError(`Error while creating playlist for ${JSON.stringify({GuildID: message.guild.id, error:err })}`)
        }
        resolve();
    });

    CrObjectforWrite.then(() => {
        //   console.log(result); // "Stuff worked!"
        fs.writeFile("./Serversfavplaylist/" + message.guild.id + ".json", CircularJSON.stringify(secopy, null, 2), "utf8", function (err) {
            if (err) {
                Command.logError(`Error while creating playlist for ${JSON.stringify({GuildID: message.guild.id, error:err })}`)
            } else{
                Command.logDebug(`Done creating playlist to { GuildID:${message.guild.id} }`)
                message.reply("All set");
              }

        });
    });
    }


  }
}
