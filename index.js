const Discord = require("discord.js");
const fs = require("fs");
const Log = require('./core/Log');

const BackUP = require('./core/BackUP');

const QueueUtils = require('./core/QueueUtils');
const ServerSettingsUtils = require('./core/ServerSettingsUtils');

const AutismCommand = require('./core/Commands/AutismCommand');
const PauseCommand = require('./core/Commands/PauseCommand');
const UnPauseCommand = require('./core/Commands/UnPauseCommand');
const SkipCommand = require('./core/Commands/SkipCommand');
const StopCommand = require('./core/Commands/StopCommand');
const CleanCommand = require('./core/Commands/CleanCommand');
const InfoCommand = require('./core/Commands/InfoCommand');
const Order66Command = require('./core/Commands/Order66Command');
const NowPlayingCommand = require('./core/Commands/NowPlayingCommand');
const QueueCommand = require('./core/Commands/QueueCommand');
const PlayCommand = require('./core/Commands/PlayCommand');
const CatCommand = require('./core/Commands/CatCommand');
const RunCommand = require('./core/Commands/RunCommand');
const CreateServerFavplaylistCommand = require('./core/Commands/CreateServerFavplaylistCommand');
const UnknowCommand = require('./core/Commands/UnknowCommand');
const InviteBotLinkCommand = require('./core/Commands/InviteBotLinkCommand');
const ShuffleCommand = require('./core/Commands/ShuffleCommand');
const UpdateServerOptionsCommand = require('./core/Commands/UpdateServerOptionsCommand');
const SetServerOptionsCommand = require('./core/Commands/SetServerOptionsCommand');

const DispatcherCreator = require('./core/DispatcherCreator');
/*
* usefull things
* var e = new Promise(()=>{ console.log(bot.ping); });e;
* var e = new Promise(function (resolve, reject) {if(!server){reject(Error("it broke"))}else{ console.log(server.video);resolve();}});e;
*/
/*
process.on('uncaughtException', function (error) {
    BackUP.do(servers);

    Log.error(`Cannot create new Discord.Client() ${JSON.stringify(error)}`);

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (data) => {
        if (data == 'exit\n') process.exit(10);
    });
});
*/
process.on('exit', (code) => {
    Log.error(`About to exit with code: ${code}`);
});

process.on("beforeExit", () => {
    Log.error(`Making Backup`);
    BackUP.do(servers);
    Log.error("See ya :0");
});

Log.info(`Loading server config`);
var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

var prefix = config.prefix;
var superprefix = config.prefix;
const yt_api_key = config.yt_api_key;
const owner = config.owner;

try {
    var bot = new Discord.Client();
} catch (err) { Log.error(`Cannot create new Discord.Client() ${JSON.stringify(err)}`);}

var servers = {};
var serversOptions = {};

bot.login(config.discord_token, (err) => {
    Log.error(`Error while logging in: ${JSON.stringify(err)}`);
});

bot.on("ready", () => {
    Log.info(`Log in :)`);
    Log.info(`I am ${bot.user.username}, and I am`);
    Log.info(`Ready! Ready! Ready! `);
    Log.info(`used token : ${config.discord_token}`);
    Log.info(`used prefix : ${prefix}`);
    Log.info(`used yt-api key : ${yt_api_key}`);

    console.log();

    bot.user.setStatus("online");
    bot.user.setPresence({ game: { name: `${config.prefix}info`, type: 0 } });
});

bot.on("message", function (message) {

    if (message.author.equals(bot.user)) return;

    var serversett;

    try {
        //if (fs.existsSync('./ServersExtraOptions/' + message.guild.id + '.json')) {
            serversett = serversOptions[message.guild.id];

            if (!(serversett.Serverprefix === undefined))
                prefix = serversett.Serverprefix;
            else
                prefix = config.prefix;
            if (serversett.Serverprefix == "")
                prefix = config.prefix;
        //}
    } catch (err) {
        prefix = config.prefix;
    }

    if (message.content.startsWith(superprefix)) prefix = superprefix;
    if (!message.content.startsWith(prefix)) return;

    var agrs = message.content.substring(prefix.length).split(" ");

    switch (agrs[0].toLowerCase()) {
        case "info":
              new InfoCommand().execute(message);
            break;
        case "autism":
              new AutismCommand().execute(message);
            break;
        case "pause":
            if(serversett)
                new PauseCommand(serversett.ServerPlayerRanks).execute(message,servers[message.guild.id]);
            else
                new PauseCommand(null).execute(message,servers[message.guild.id]);
            break;
        case "unpause":
            if(serversett)
                new UnPauseCommand(serversett.ServerPlayerRanks).execute(message,servers[message.guild.id]);
            else
                new UnPauseCommand(null).execute(message,servers[message.guild.id]);
            break;
        case "clean":
            if(serversett)
                new CleanCommand(serversett.ServerCleanerRank).execute(message, prefix.length);
            else
                new CleanCommand(null).execute(message, prefixLenght);
            break;
        case "play":
            QueueUtils.createQueueIfNecessary(servers, message.guild.id);
            if(serversett)
                new PlayCommand(serversett.ServerPlayerRanks).execute(message, servers[message.guild.id], prefix.length ,yt_api_key);
            else
                new PlayCommand(null).execute(message, servers[message.guild.id], prefixLenght,yt_api_key);
            break;
        case "create_server_favplaylist":
            if(serversett)
                new CreateServerFavplaylistCommand(serversett.ServerDJRanks).execute(message, servers[message.guild.id], owner);
            else
                new CreateServerFavplaylistCommand(null).execute(message, servers[message.guild.id], owner);
            break;
        case "backup":
            if ((message.author.id == owner))
                servers = BackUP.load();
            break;
        case "order66":
            if ((message.author.id == owner))
                new Order66Command().execute(message);
            break;
        case "skip":
            if(serversett)
                new SkipCommand(serversett.ServerPlayerRanks).execute(message, servers[message.guild.id],prefix.length);
            else
                new SkipCommand(null).execute(message, servers[message.guild.id],prefix.length);
            break;
        case "shuffle":
            if(serversett)
                new ShuffleCommand(serversett.ServerPlayerRanks).execute(message,servers[message.guild.id]);
            else
                new ShuffleCommand(null).execute(message,servers[message.guild.id]);
            break;
        case "stop":
            if(serversett)
                new StopCommand(serversett.ServerPlayerRanks).execute(message,servers[message.guild.id]);
            else
                new StopCommand(null).execute(message,servers[message.guild.id]);
            break;
        case "queue":
            var prefixLenght = prefix.length;
            if(serversett)
                new QueueCommand(serversett.ServerPlayerRanks).execute(message,servers[message.guild.id], prefixLenght);
            else
                new QueueCommand(null).execute(message,servers[message.guild.id], prefixLenght);
            break;
        case "get_invite_bot_link":
                new InviteBotLinkCommand().execute(message,bot.user.avatarURL);
            break;
        case "nowplaying":
            if(serversett)
                new NowPlayingCommand(serversett.ServerPlayerRanks).execute(message,servers[message.guild.id]);
            else
                new NowPlayingCommand(null).execute(message,servers[message.guild.id]);
            break;
        case "run":
                new RunCommand().execute(message, prefix.length, owner);
            break;
        case "update_server_options":
                new UpdateServerOptionsCommand().execute(message, serversOptions,owner);
            break;
        case "set_server_options":
                new SetServerOptionsCommand().execute(message,agrs,serversOptions,owner,bot.user.avatarURL);
            break;
        case "cat":
                new CatCommand().execute(message);
            break;
        default:
                new UnknowCommand().execute(message);
            break;
    }
});
