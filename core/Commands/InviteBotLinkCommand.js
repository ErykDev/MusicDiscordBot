const Command = require('./Command');


module.exports = class InviteBotLinkCommand extends Command{

  execute(message,avatarURL){
    super.execute(message, Command.GET_INVITE_BOT_LINK());

    Command.logDebug(`Sending Got invite Link to ${message.author.id}`);

    message.author.send({
        embed: {
            color: 3447003,
            author: {
                name: "Scotsman",
                icon_url: avatarURL
            },
            title: "Invite Link",
            description: "https://discordapp.com/oauth2/authorize?client_id=428263867907571713&permissions="+322043009+"&scope=bot",
            timestamp: new Date(),
            footer: {
                icon_url: avatarURL,
                text: ""
            }
        }
    });
  }

}
