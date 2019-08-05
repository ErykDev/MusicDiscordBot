const Command = require('./Command');
const QueueUtils = require('../QueueUtils');

module.exports = class StopCommand extends Command{

  StopCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }

  execute(message,server){
    super.execute(message, Command.STOP());

    if (typeof ServerDJRanks === 'undefined') {
        if ((QueueUtils.serverQueueExist(message,server)))
        this.Cleanqueue(message,server);
          return;
    } else if (ServerDJRanks == "" || ServerDJRanks == null) {
        if ((QueueUtils.serverQueueExist(message,server)))
        this.Cleanqueue(message,server);
          return;
    } else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x))) {
        if ((QueueUtils.serverQueueExist(message,server)))
        this.Cleanqueue(message,server);
          return;
    } else {
        message.reply(" you don't have permison to do that :grimacing: ");
    }
  }

  Cleanqueue(message,server) {
      try {
          if (!server.video.queue) {
              message.channel.send("if you want 2 use all options first play something  :)");
              return;
          }
      } catch (err) {
              message.channel.send("if you want 2 use all options first play something  :)");
              return;
      }
      try {
          if (!message.guild.voiceConnection) {
                  message.channel.send("i'm not in your channel");
                  return;
          }
          if (message.guild.voiceConnection) {
              Command.logDebug(`Cleaning Queue at ${message.guild.id}`);

              var lengthBeforeCleaning = server.video.queue.length;

              for (var i = server.video.queue.length - 1; i >= 0; i--) {
                  server.video.queue.splice(i, 1);
                  server.video.videodescription.splice(i, 1);
                  server.video.videothumbnailUrl.splice(i, 1);
                  server.video.videotitle.splice(i, 1);
              }

              Command.logDebug(`Stoping dispatcher at ${message.guild.id}`);
              server.dispatcher.end();

              if (server.video.queue.length == 1) {
                  message.channel.send("The queue has been emptied ** 1 ** track has been removed.");
              } else {
                  message.channel.send("The queue has been emptied **" + lengthBeforeCleaning + "** track(s) has been removed.");
              }
          }
      } catch(err) {
            Command.logError(JSON.stringify(err));
      };

  }
}
