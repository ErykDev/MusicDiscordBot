const Command = require('./Command');
const QueueUtils = require('../QueueUtils');
const TextUtils = require('../TextUtils');

module.exports = class NowPlayingCommand extends Command{

  PauseCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }

  execute(message,server){
    super.execute(message, Command.NOWPLAYING());

    if (typeof ServerDJRanks === 'undefined') {

      this.shownowplayinginfo(message,server);
      return;

    } else if (ServerDJRanks == "" || ServerDJRanks == null) {

        this.shownowplayinginfo(message,server);
        return;

    } else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x))) {

        this.shownowplayinginfo(message,server);
        return;

    } else {
        message.reply(" you don't have permison to do that :grimacing: ");
    }
  }

  getvidtime(server) {
    Number.prototype.asYTime = function () {
      var hour = Math.floor(this / 3600),
          min = Math.floor((this - hour * 3600) / 60),
          sec = this - hour * 3600 - min * 60,
          hourStr, minStr, secStr;
      if (hour) {
          hourStr = hour.toString(),
              minStr =  min.toString();
          secStr =  sec.toString();
          return hourStr + "h" + minStr + "m" + secStr + "s";
      }
      if (min) {
          minStr = min.toString();
          secStr =  sec.toString();
          return minStr + "m" + secStr + "s";
      }
      return sec.toString() + "s";
    };

      return server.isPlaying ? "?t=" + (Math.round(server.dispatcher.time / 1000)).asYTime() : "";
  }

  shownowplayinginfo(message,server) {
    if (!(QueueUtils.serverQueueExist(message,server))) {
        return;
    }

    if (server.video.queue[0] && server.dispatcher) {

        var embed = new Discord.RichEmbed()
            .setThumbnail(server.video.videothumbnailUrl[0])
            .setDescription('**' + "NoW playing :" + " " + server.video.videotitle[0] + "**" + "\n" + "https://youtu.be/" + server.video.queue[0] + this.getvidtime(server) + "\n" + "\n" + TextUtils.descriptonCheacker(server.video.videodescription[0]))
            .setColor("7f0c0c")
        message.channel.sendEmbed(embed);

    } else {
        message.channel.send("nothing playing now :)");
    }
    if (server.video.queue === undefined) {
        message.channel.send("nothing playing now :)");
    }
  }

}
