const Command = require('./Command');
const ServerSettingsUtils = require('../ServerSettingsUtils');

module.exports = class UpdateServerOptionsCommand extends Command{

  execute(message, serversOptions=[],owner){
    super.execute(message, Command.UPDATE_SERVER_OPTIONS());

    if (!message.member.roles.some(r => ["Admin", "Mod", "Moderator"].includes(r.name)) || (message.author.id == message.guild.owner.id)) return;

    try {
        Command.logDebug(`Saving Server Settings for ${message.member.voiceChannel.id}`)
        ServerSettingsUtils.saveOptions(serversOptions[message.guild.id], message.guild.id);

        message.reply("Done Updating Settings");
    } catch (err) {
        Command.logError(JSON.stringify(err));
    }

  }

}
