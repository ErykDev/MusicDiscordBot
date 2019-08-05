const Command = require('./Command');
const DispatcherCreator = require('../DispatcherCreator');
const QueueUtils = require('../QueueUtils');

module.exports = class UnPauseCommand extends Command{

  UnPauseCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }

  execute(message,server){
    super.execute(message, Command.UNPAUSE());

    if (typeof ServerDJRanks === 'undefined') {
        this.unpauseThequeue(message,server);
        return;

    } else if (ServerDJRanks == "" || ServerDJRanks == null) {
        this.unpauseThequeue(message,server);
        return;
    } else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x))) {
        this.unpauseThequeue(message,server);
        return;

    } else {
        message.reply(" you don't have permission :grimacing: ");
    }
  }

  unpauseThequeue(message,server) {
      if (!(QueueUtils.serverQueueExist(message,server))) {
          return;
      }
      if (!message.member.voiceChannel) {
          message.author.send("join channel first :)");
          return;
      }
      if (!server.video.queue[0]) {
          message.channel.send("queue is empty");
          return;
      }

      Command.logDebug(`Unpausing Dispatcher at ${message.guild.id}`)

      if (!message.guild.voiceConnection) {
          if (message.member.voiceChannel.joinable) {
            Command.logDebug(`Joining ${message.member.voiceChannel.id}`)
              message.member.voiceChannel.join().then(function (connection) {
                  Command.logDebug(`Starting Dispatcher at ${message.member.voiceChannel.id}`)
                  new DispatcherCreator().start(server,connection, message);

                  server.isitEnd = false;
                  server.isPlaying = true;

              }).catch(err => {
                Command.logError(JSON.stringify(err));
              });
          } else {
              message.channel.send("bot can't join: " + message.member.voiceChannel + " :cold_sweat:");
          }
      }
  }

}
