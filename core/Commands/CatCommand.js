const Command = require('./Command');
const request = require("request");

module.exports = class CatCommand extends Command{

  execute(message){
    super.execute(message, Command.CAT());

    Command.logDebug("requesting http://aws.random.cat/meow");

    request("http://aws.random.cat/meow", function (error, response, body) {
        var json = JSON.parse(body);
        if (!json.file || error){
          Command.logWarn(`request failed ${error}`);
        }
        else {
          Command.logDebug(`request succesed ${JSON.stringify(json)}`);
            message.channel.send({
                embed: {
                    title: "So Cute :heart_eyes: ",
                    color: 3447003,
                    image: {
                        url: json.file
                    },
                    timestamp: new Date()
                }
            });
        }
        return;
    });
  }
}
