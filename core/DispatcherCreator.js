const YTDL = require("ytdl-core");

module.exports = class DispatcherCreator{

  DispatcherCreator(){
  }

  start(server,connection, message) {
      server.dispatcher = connection.playStream(YTDL("https://www.youtube.com/watch?v=" + server.video.queue[0],
          { filter: "audioonly" }), {
             seek: 0,
             volume: 1,
             type: 'opus'
           });

      server.dispatcher.on("error", (error) => {
          if (error) {
              console.log(Error("server.dispatcher.on.error()"));
          for (var i = server.video.queue.length - 1; i >= 0; i--) {
              server.video.queue.splice(i, 1);
              server.video.videodescription.splice(i, 1);
              server.video.videothumbnailUrl.splice(i, 1);
              server.video.videotitle.splice(i, 1);
          } server.dispatcher.end();

          server.isPlaying = false;
          server.isitEnd = false;

         }
          return;
      });
      server.dispatcher.on("reconnecting", () => {
          console.log("bot reconnecting..." + server.dispatcher.channel);
      });
      server.dispatcher.on("end", () => {
          var ost = server.video.queue[server.video.queue.length - 1];

          if (server.isitEnd == true) {
              server.isPlaying = false;
              server.isitEnd = false;
              connection.disconnect();
              return;
          }

          if (!message.member.voiceChannel || !message.guild.voiceConnection) {
              server.isPlaying = false;
              server.isitEnd = false;

              server.video.videodescription.shift();
              server.video.videothumbnailUrl.shift();
              server.video.videotitle.shift();
              server.video.queue.shift();
              connection.disconnect();
              return;
          }

          if (!(server.video.queue[0] === server.video.queue[1])) {
              if (server.video.queue[0] === ost) {
                  server.video.videodescription.shift();
                  server.video.videothumbnailUrl.shift();
                  server.video.videotitle.shift();
                  server.video.queue.shift();

                  connection.disconnect();
                  server.isPlaying = false;

                  return;
              }
          }
          if (server.video.queue[0]) {

              server.video.videodescription.shift();
              server.video.videothumbnailUrl.shift();
              server.video.videotitle.shift();
              server.video.queue.shift();

              this.start(server,connection, message);
          } else {
              connection.disconnect();
              server.isPlaying = false;
          }
      });
  }
}
