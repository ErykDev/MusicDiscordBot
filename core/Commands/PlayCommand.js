const Command = require('./Command');
var CircularJSON = require('circular-json');
const DispatcherCreator = require('../DispatcherCreator');
const TextUtils = require('../TextUtils');
const YTDL = require("ytdl-core");
var ypi = require('youtube-playlist-info');
const fs = require('fs');
var fetchVideoInfo = require("youtube-info");

const YTLoader = require('../YTLoader');

module.exports = class PlayCommand extends Command{

  PlayCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }

  execute(message, server, prefixLenght, yt_api_key){
    super.execute(message, Command.PLAY());

    if (typeof ServerDJRanks === 'undefined') {
        playMusicSwitch(prefixLenght);
        return;
    } else if (ServerDJRanks == "" || ServerDJRanks == null) {
        playMusicSwitch(prefixLenght);
        return;
    } else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x))) {
        playMusicSwitch(prefixLenght);
        return;
    } else {
        message.reply(" you don't have permission :grimacing: ");
    }

    function addPlaylist(PlayilstId) {
        ypi.playlistInfo(yt_api_key, PlayilstId, function (playlistItems) {
            if (!playlistItems || !playlistItems[1]) {
                message.reply("i can't add this queue :sob: ");
                return;
            }
            var k = 0;
            while (playlistItems[k]) {
                server.video.queue.push(playlistItems[k].resourceId.videoId);
                server.video.videotitle.push(playlistItems[k].title);
                if (TextUtils.countWords(playlistItems[k].description) < 700) {
                    server.video.videodescription.push(playlistItems[k].description);
                } else {
                    server.video.videodescription.push("Jesus how long description i'm 2 busy :<");
                }
                if (!(playlistItems[k].thumbnails.default.url === undefined)) {
                    server.video.videothumbnailUrl.push(playlistItems[k].thumbnails.default.url);
                } else {
                    server.video.videothumbnailUrl.push("https://i.ytimg.com/vi/ppYjr0yt5Cc/maxresdefault.jpg");
                }
                k++;
            }
            if (playlistItems) {
                message.reply("Your playlist **(" + playlistItems.length + ")** sounds has been added to queue :ok_hand: ");
            } else {
                message.reply("I can't add this playlist :frowning: ");
            }
        });
    }

    function playMusicSwitch(prefixLenght) {
      var agrs = message.content.substring(prefixLenght).split(" ");
        if (!agrs[1]) {
            if (!message.member.voiceChannel) {
                message.author.send("join channel first :)");
                return;
            }

            if (!server.video.queue[0]) {
                message.channel.send("queue is empty");
                return;
            }

            if (!message.guild.voiceConnection) {
                if (message.member.voiceChannel.joinable) {
                    Command.logDebug(`Joining ${message.member.voiceChannel.id}`);
                    message.member.voiceChannel.join().then(function (connection) {
                        Command.logDebug(`Starting Dispatcher at ${message.member.voiceChannel.id}`)
                        new DispatcherCreator().start(server,connection, message);
                        server.isitEnd = false;
                        server.isPlaying = true;
                    }).catch(err => {
                      Command.logError(JSON.stringify(err));
                    });
                } else {
                    message.channel.send("bot can't join: " + message.member.voiceChannel + " :cold_sweat:");
                }
            }
            return;

        } if (agrs[1] == "server_favplaylist" && !agrs[2]) {
            if (fs.existsSync('./Serversfavplaylist/' + message.guild.id + '.json')) {

                if (!server.isPlaying) {
                  Command.logDebug(`Cleaning Queue at ${message.guild.id}`);
                  for (var i = server.video.queue.length - 1; i >= 0; i--) {
                      server.video.queue.splice(i, 1);
                      server.video.videodescription.splice(i, 1);
                      server.video.videothumbnailUrl.splice(i, 1);
                      server.video.videotitle.splice(i, 1);
                  }

                    if (!message.guild.voiceConnection) {
                        if (message.member.voiceChannel.joinable) {


                          Command.logDebug(`Pushing queue of ${message.guild.id} with playlist from ./Serversfavplaylist/${message.guild.id}.json`);

                          try {
                              var jsonqueue = CircularJSON.parse(fs.readFileSync('./Serversfavplaylist/' + message.guild.id + '.json', 'utf-8'));

                              Command.logDebug(`Pushing queue of ${message.guild.id} with playlist`);
                              for (var i = 0; i < jsonqueue.video.queue.length; i++) {
                                server.video.queue.push(jsonqueue.video.queue[i]);
                                server.video.videodescription.push(jsonqueue.video.videodescription[i]);
                                server.video.videotitle.push(jsonqueue.video.videotitle[i]);
                                server.video.videothumbnailUrl.push(jsonqueue.video.videothumbnailUrl[i]);
                              }
                          } catch (err) {
                                Command.logError("Error while preparing queue(to run playlistv2)");
                          }

                                Command.logDebug(`Joining ${message.member.voiceChannel.id}`)
                                message.member.voiceChannel.join().then(function (connection) {
                                  Command.logDebug(`Starting Dispatcher at ${message.member.voiceChannel.id}`)
                                  new DispatcherCreator().start(server,connection, message);
                                  //play(connection, message);
                                  server.isPlaying = true;
                                  //nowplayingg.push(server.video.queue[0].toString());
                                  // console.log(nowplayingg);
                                  message.channel.send("bot join: " + message.member.voiceChannel);
                                  message.reply(" Now playing: server fav playlist. Starts with: **" + server.video.videotitle[0] + '**');
                            }).catch(err => {
                              Command.logError(JSON.stringify(err));
                            });
                        } else {
                            message.channel.send("bot can't join: " + message.member.voiceChannel + " :cold_sweat:");
                        }
                    }
                    return;
                } else {

                        if (server.video.queue.length > 1) {
                            try {
                                Command.logDebug(`Cleaning Queue at ${message.guild.id}`);
                                for (var i = server.video.queue.length - 1; i >= 1; i--) {
                                    server.video.queue.splice(i, 1);
                                    server.video.videodescription.splice(i, 1);
                                    server.video.videothumbnailUrl.splice(i, 1);
                                    server.video.videotitle.splice(i, 1);
                                }
                            } catch (err) {
                                Command.logError("Error while preparing queue(to run playlist)");
                            }
                        }
                        Command.logDebug(`Pushing queue of ${message.guild.id} with playlist`);
                        try {
                            var jsonqueue = CircularJSON.parse(fs.readFileSync('./Serversfavplaylist/' + message.guild.id + '.json', 'utf-8'));

                            Command.logDebug(`Pushing queue of ${message.guild.id} with playlist`);
                            for (var i = 0; i < jsonqueue.video.queue.length; i++) {
                              server.video.queue.push(jsonqueue.video.queue[i]);
                              server.video.videodescription.push(jsonqueue.video.videodescription[i]);
                              server.video.videotitle.push(jsonqueue.video.videotitle[i]);
                              server.video.videothumbnailUrl.push(jsonqueue.video.videothumbnailUrl[i]);
                            }
                        } catch (err) {
                              Command.logError("Error while preparing queue(to run playlistv2)");
                        }

                        message.reply("Now playing: server fav playlist. Starts with: **" + server.video.videotitle[0] + '**');
                        server.dispatcher.end();
                }
            } else
                message.reply("Playlist don't exist or file missing :grimacing: ");
            return;
        }
        if (!message.member.voiceChannel) {
            message.author.send("join channel first :)");
            return;
        }
        try {
            if (message.member.voiceChannel) {
                YTLoader.getID(yt_api_key,message.content.substring(prefixLenght + 4).split(" "), function (id) {
                    if (id.isitPlaylist) {
                        Command.logDebug(`Adding playlist to Queue:${message.guild.id} PlaylistID:${id.id}`);
                        addPlaylist(id.id);
                    } else {

                        if (TextUtils.isYoutubeLink(id.id)) {
                            server.video.queue.push(getYouTubeID(id.id));
                        } else {
                            server.video.queue.push(id.id);
                        }

                        fetchVideoInfo(id.id, function (err, videoInfo) {
                            if (err) {
                                throw new Error(err);
                                Command.logError(`Error while fetching Video id:${id.id} Err:${err}`);
                                return;
                            }
                            message.reply(' The song: **' + videoInfo.title + "** has been added to the queue list.");
                            server.video.videotitle.push(videoInfo.title);
                            server.video.videodescription.push(TextUtils.descriptonCheacker(videoInfo.description));
                            server.video.videothumbnailUrl.push(videoInfo.thumbnailUrl);

                            if (!message.guild.voiceConnection) {
                              if (message.member.voiceChannel.joinable) {
                                Command.logDebug(`Joining ${message.member.voiceChannel.id}`);
                                message.member.voiceChannel.join().then(function (connection) {

                                Command.logDebug(`Starting Dispatcher at ${message.member.voiceChannel.id}`)
                                new DispatcherCreator().start(server,connection, message);

                                server.isPlaying = true;
                                message.channel.send("bot join: " + message.member.voiceChannel);

                                }).catch(err => {
                                  Command.logError(JSON.stringify(err));
                                });
                              } else {
                                message.channel.send("bot can't join: " + message.member.voiceChannel + " :cold_sweat:");
                              }
                            }
                        });
                    }
                });
            }
        } catch (err) {
            message.channel.send("somethings goes wrong");
            Command.logError(JSON.stringify(err));
        }
    }
  }
}
