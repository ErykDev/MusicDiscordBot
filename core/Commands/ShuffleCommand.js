const Command = require('./Command');
const QueueUtils = require('../QueueUtils');

module.exports = class ShuffleCommand extends Command{

  PauseCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }

  execute(message, server){
    super.execute(message, Command.SHUFFLE());

    if (typeof ServerDJRanks === 'undefined') {
      this.shuffle(message, server);
        return;

    } else if (ServerDJRanks == "" || ServerDJRanks == null) {
      this.shuffle(message, server);
        return;

    } else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x))) {
      this.shuffle(message, server);
        return;

    } else {
        message.reply("you don't have permission :grimacing: ");
    }
  }

  shuffle(message, server){
    Command.logDebug(`Shuffling queue at ${message.guild.id}`)
    QueueUtils.shuffleQueue(server);
    message.channel.send("Shuffled :)");
  }
}
