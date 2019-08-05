const Command = require('./Command');
const request = require("request");

module.exports = class RunCommand extends Command{

  execute(message, prefixLength, owner){
    super.execute(message, Command.RUN());

    if (!(message.author.id === owner)) {
        return;
    }

    try {
        var F = new Function(message.content.slice(prefixLength + 3));
        return (F());
    } catch (err) {
        message.reply("syntax err: "+err);
    }
  }
}
