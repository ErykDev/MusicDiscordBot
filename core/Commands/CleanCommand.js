const Command = require('./Command');


module.exports = class CleanCommand extends Command {

  CleanCommand(ServerControlerRanks){
    this.ServerControlerRanks = ServerControlerRanks;
  }

  execute(message, prefixLenght){
    super.execute(message, Command.CLEAN());

    var numberofmessages = message.content.substring(prefixLenght + 6);

    if (typeof ServerControlerRanks === 'undefined') {
        this.cleanMess(message, numberofmessages);
        return;

    } else if (ServerControlerRanks == "" || ServerControlerRanks == null) {
        this.cleanMess(message, numberofmessages);
        return;

    } else if (ServerControlerRanks.split(";").some(x => message.member.roles.has(x))) {
        this.cleanMess(message, numberofmessages);
        return;
    }
  }

  cleanMess(message,numberofmessages) {
      if (!numberofmessages) {
          message.channel.send("no value :)");
          return;
      }
      if (isNaN(numberofmessages)) {
          message.channel.send("Can't read that");
          return;
      }
      if (numberofmessages > 99) {
          message.channel.send("2 big number");
          return;
      }
      if (numberofmessages == 1) {
          numberofmessages = 2;

          Command.logDebug(`Cleaning last message from ${message.channel.name}  ${message.guild.id}`)

          let messagecount = parseInt(numberofmessages);
          message.channel.fetchMessages({ limit: messagecount }).then(function (messages) {
              message.channel.bulkDelete(messages);
          }, function (err) {

            Command.logDebug(`Error while cleaning ${message.channel.name}  ${message.guild.id} Error: ${err}`)

            message.channel.send("ERROR: ERROR CLEARING CHANNEL.")
          });
          message.channel.send("Done. bot dealated `" + 1 + "` message by: " + message.author);
          return;
      }
      if (numberofmessages > 1) {

          let messagecount = parseInt(numberofmessages++);

          Command.logDebug(`Cleaning ${messagecount} messages from ${message.channel.name}  ${message.guild.id}`)

          message.channel.fetchMessages({ limit: messagecount }).then(function (messages) {
              message.channel.bulkDelete(messages);
          }, function (err) { message.channel.send("ERROR: ERROR CLEARING CHANNEL.") });

          if (!message.channel.fetchMessages({ limit: messagecount })) {
              message.channel.send("something goes wrong propadbly message are odler than 14 days");
          }
          message.channel.send("Done. bot dealated `" + (numberofmessages - 1) + "` messages by: " + message.author);
      }
  }

}
