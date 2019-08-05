const Command = require('./Command');
const QueueUtils = require('../QueueUtils');

module.exports = class SkipCommand extends Command{

  SkipCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }

  execute(message,server,prefixLenght){
    super.execute(message, Command.SKIP());

    var agrs = message.content.substring(prefixLenght).split(" ");

    if (!(QueueUtils.serverQueueExist(message,server))) {
        console.log("err");
        return;
    }

      if (typeof ServerDJRanks === 'undefined')
          this.SkipElemfromQueue(message,server,agrs);
       else if (ServerDJRanks == "" || ServerDJRanks == null)
          this.SkipElemfromQueue(message,server,agrs);
       else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x)))
          this.SkipElemfromQueue(message,server,agrs);
       else
          message.reply(" you don't have permison to do that :grimacing: ");

    }

  SkipElemfromQueue(message,server,agrs = []) {
    if (!agrs[1]) {
      if (!message.member.voiceChannel) {
          message.author.send("join channel first :)");
          return;
      }
      try {
          if (!server.video.queue[0]) {
              message.channel.send("queue is empty");
              return;
          }
          if (server.isPlaying && server.video.queue[0]) {
              message.channel.send(message.author + '**' + " skiped: " + server.video.videotitle[0] + '**');
              server.dispatcher.end();
          }
      } catch (err) {
          console.log(err);
      }
  }else {

    if (isNaN(agrs[1])) {
        message.channel.send("Can't read that number");
        return;
    }

    if (agrs[1] > server.video.queue.length) {
        message.channel.send("number bigger than queue");
        return;
    }else {

      if (server.isPlaying) {
        for (var i = agrs[1] - 1; i >= 0; i--) {
            server.video.queue.splice(i, 1);
            server.video.videodescription.splice(i, 1);
            server.video.videothumbnailUrl.splice(i, 1);
            server.video.videotitle.splice(i, 1);
        }
        server.dispatcher.end();

        message.channel.send(message.author + '**' + " skiped: " + agrs[1] + '**'+" tracks");
      }
    }
}
}
}
