const Command = require('./Command');

module.exports = class UnknowCommand extends Command{
  execute(message){
      super.execute(message, Command.Unknown());

      message.channel.send("invalid command");
  }
}
