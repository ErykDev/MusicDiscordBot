const Command = require('./Command');
const QueueUtils = require('../QueueUtils');


module.exports = class PauseCommand extends Command{

  PauseCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }


  execute(message, server){
    super.execute(message, Command.PAUSE());

    if (typeof ServerDJRanks === 'undefined') {

        this.pausequeueonserver(message, server);
        return;

    } else if (ServerDJRanks == "" || ServerDJRanks == null) {

        this.pausequeueonserver(message, server);
        return;

    } else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x))) {

        this.pausequeueonserver(message, server);
        return;
    } else {
        message.reply("you don't have permission :grimacing: ");
    }

  }

  pausequeueonserver(message, server) {

      if (!(QueueUtils.serverQueueExist(message, server))) {
          return;
      }

      Command.logDebug(`Pausing dispatcher at ${message.guild.id}`);

      if (!server.video.queue[0]) {
          message.reply("queue is empty");
          return;
      }

      if (server.dispatcher && server.video.queue[0]) {
          server.isitEnd = true;

          server.dispatcher.end();
      }
  }
}
