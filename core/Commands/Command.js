const Log = require('../Log');

module.exports = class Command{

  execute(message, UsedCommand){
    this.removeMessageFromChat(message);
    Log.info(JSON.stringify({ Command: UsedCommand, Requester: message.author.id, GuildID: message.guild.id, ChannelID: message.channel.id }));
  }

  removeMessageFromChat(message){
    message.delete(100, function (err) {
        if (err) Log.error(err);
    });
  }

  static getLogger(){ return Log; }
  static logError(message){ Log.error(message); }
  static logWarn(message){ Log.warn(message); }
  static logDebug(message){ Log.debug(message); }

  static INFO(){return "Info";}
  static AUTISM(){return "Autism";}
  static PAUSE(){return "Pause";}
  static UNPAUSE(){return "Unpause";}
  static CLEAN(){return "Clean";}
  static PLAY(){return "Play";}
  static CREATE_SERVER_FAVPLAYLIST(){return "CreateServerFavplayList";}
  static BACKUP(){return "Backup";}
  static ORDER66(){return "Order66";}
  static SKIP(){return "Skip";}
  static SHUFFLE(){return "Shuffle";}
  static STOP(){return "Stop";}
  static QUEUE(){return "Queue";}
  static GET_INVITE_BOT_LINK(){return "GetInviteBotLink";}
  static NOWPLAYING(){return "NowPlaying";}
  static RUN(){return "Run";}
  static UPDATE_SERVER_OPTIONS(){return "UpdateServerOptions";}
  static SET_SERVER_OPTIONS(){return "set_server_options";}
  static CAT(){return "cat";}
  static Unknown(){return "Unknown";}
}
