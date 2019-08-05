const Command = require('./Command');
const ServerSettingsUtils = require('../ServerSettingsUtils');
const UpdateServerOptionsCommand = require('./UpdateServerOptionsCommand');




module.exports = class SetServerOptionsCommand extends Command{
  execute(message,agrs=[],serversOptions = [],owner,avatarURL){
    super.execute(message, Command.SET_SERVER_OPTIONS());

    console.log("arg");
    if (!(message.member.roles.some(r => ["Admin", "Mod", "Moderator", "Owner"].includes(r.name)) || !(message.author.id == message.guild.owner.id))) {
        return;
    }

    ServerSettingsUtils.createServerSettingsIfNecessary(serversOptions, message.guild.id);

    var ServersOption = serversOptions[message.guild.id];

    if (!agrs[1]) {
        message.channel.send({
            embed: {
                color: 3447003,
                author: {
                    name: "Scotsman",
                    icon_url: avatarURL
                },
                title: "set_server_options",
                description: "Set advance server settings",
                //  thumbnail: {
                //     url: "https://cdn.discordapp.com/attachments/246376192750518272/389880917721612309/toga_himiko_boku_no_hero_academia_drawn_by_pocari_sweat_artist__sample-89d794970128eac41fa959e0e90ed.png"
                //  },
                fields: [
                    {
                        name: "set_server_prefix",
                        value: "set_server_options set_server_prefix **prefix** \n if y leave it blank your server will stay with common && prefix"
                    },
                    {
                        name: "set_server_cleaner_rank",
                        value: "set_server_options set_server_cleaner_rank {ranks separeted by ;}  \n if y leave it blank everyone can clean chat with bot"
                    },
                    {
                        name: "set_server_player_rank",
                        value: "set_server_options set_server_player_rank {ranks separeted by ; } if y leave it blank everyone can play music on bot"
                    },
                    {
                        name: "set_server_serverdj",
                        value: "set_server_options set_server_serverdj {ranks separeted by ; } if y leave it blank everyone can create server playlist"
                    },
                    {
                        name: "View server settings",
                        value: "set_server_options view_server_set"
                    },
                    {
                        name: "also dont'forget to apply chnges",
                        value: "update_server_options"
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: avatarURL,
                    text: ""
                }
            }
        });
    }

    if (agrs[1] == "view_server_set") {

            var Messresult = "";

            if (serversOptions[message.guild.id].Serverprefix != "")
                Messresult += `Special Server prefix: ${ServersOption.Serverprefix}`+ "\n";
            if (serversOptions[message.guild.id].ServerCleanerRank != "")
                Messresult += `Cleaning on your server require this rank: ${ServersOption.ServerCleanerRank}`+ "\n";
            if (serversOptions[message.guild.id].ServerPlayerRanks != "")
                Messresult += `Using music options on your server require this rank: ${ServersOption.ServerPlayerRanks}` + "\n";
            if (serversOptions[message.guild.id].ServerDJRanks != "")
                Messresult += `Creating playlist/using music player on your server require this rank: ${ServersOption.ServerDJRanks}` + "\n";

            if (Messresult != "") {

                var embed = new Discord.RichEmbed()
                    .setDescription(Messresult)
                    .setColor("7f0c0c")
                message.author.sendEmbed(embed);

            } else {
                message.reply(" Your server don't have any special things :pensive: ");
            }
    }


    if (agrs[1] == "update_server_options") {
      new UpdateServerOptionsCommand().execute(message, serversOptions, message.guild.owner.id);
          //ServerSettingsUtils.setServerDJRanks(message, ServersOption, agrs[2]);
    }

    if (agrs[1] == "set_server_serverdj") {
      if (!agrs[2]) {
          message.reply("value can't be empty");
          return;
      }
          ServerSettingsUtils.setServerDJRanks(message, ServersOption, agrs[2]);
    }

    if (agrs[1] == "set_server_prefix") {
      if (!agrs[2]) {
          message.reply("prefix can't be empty");
          return;
      }
        ServerSettingsUtils.setServerprefix(message, ServersOption, agrs[2]);
    }

    if (agrs[1] == "set_server_cleaner_rank")
        ServerSettingsUtils.setServerCleanerRank(message, ServersOption, agrs[2]);
    if (agrs[1] == "set_server_player_rank")
        ServerSettingsUtils.setServerPlayerRanks(message, ServersOption, agrs[2]);

    serversOptions[message.guild.id] = ServersOption;

  }
}
