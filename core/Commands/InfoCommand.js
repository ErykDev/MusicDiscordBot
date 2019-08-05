const Command = require('./Command');


module.exports = class InfoCommand extends Command{

  execute(message){
    super.execute(message, Command.INFO());


    message.author.send({
        embed: {
            color: 3447003,
            author: {
                name: "Scotsman",
              //  icon_url: bot.user.avatarURL
            },
            title: "Info",
            description: "Bot created by Scotsman i hope y enjoy :)",
            //  thumbnail: {
            //      url: "https://cdn.discordapp.com/attachments/246376192750518272/389880917721612309/toga_himiko_boku_no_hero_academia_drawn_by_pocari_sweat_artist__sample-89d794970128eac41fa959e0e90ed.png"
            //  },
            //image: {
            //    url: "https://cdn.discordapp.com/attachments/246376192750518272/389880917721612309/toga_himiko_boku_no_hero_academia_drawn_by_pocari_sweat_artist__sample-89d794970128eac41fa959e0e90ed.png"
            //},
            fields: [{
                name: "Prefix",
                value: "&&"
            },
            {
                name: "info",
                value: "&&info"
            },
            {
                name: "playing music",
                value: "&&play value"
            }, {
                name: "pausing queue",
                value: "&&pause"
            },
            {
                name: "unpausing queue",
                value: "&&unpause"
            },
            {
                name: "cleaning queue",
                value: "&&stop"
            },
            {
                name: "skiping part",
                value: "&&skip"
            },
            {
                name: "Showing cute cat pic",
                value: "&&cat"
            },
            {
                name: "Cleaning chat",
                value: "&&clean [value]"
            },
            {
                name: "Creating server playlist (require set role by admin/serverOwner)",
                value: "&&create_server_favplaylist"
            },
            {
                name: "Advanced bot options for Owners and Admins",
                value: "&&set_server_options"
            }
            ],
            timestamp: new Date(),
            footer: {
              //  icon_url: bot.user.avatarURL,
                text: ""
            }
        }
    });
    //message.channel.send("Message with info was send to " + message.author);
  }
}
