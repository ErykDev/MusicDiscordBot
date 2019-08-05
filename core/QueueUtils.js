module.exports = class QueueUtils{

  static createQueueIfNecessary(servers = [], guildID){
    if (!servers[guildID]) {
        servers[guildID] = {
            video: {
                queue: [],
                videodescription: [],
                videotitle: [],
                videothumbnailUrl: [],
            },
            isitEnd: false,
            isPlaying: false
        };
    }
  }

  static shuffleQueue(server){

    Array.prototype.pushArray = function (arr) {
        this.push.apply(this, arr);
    };

    var newQueue = new Array();

    for (var i = 0; i < server.video.queue.length; i++) {
        newQueue.push({
          id: server.video.queue[i],
          videodescription: server.video.videodescription[i],
          videotitle: server.video.videotitle[i],
          videothumbnailUrl:server.video.videothumbnailUrl[i]
        });
    }

    newQueue.sort(() => Math.random() - 0.5);

    for (var i = server.video.queue.length; i >= 0; i--) {
        server.video.queue.splice(i, 1);
        server.video.videodescription.splice(i, 1);
        server.video.videothumbnailUrl.splice(i, 1);
        server.video.videotitle.splice(i, 1);
    }

    for (var i = 0; i < newQueue.length; i++) {
      server.video.queue.push(newQueue[i].id);
      server.video.videodescription.push(newQueue[i].videodescription);
      server.video.videotitle.push(newQueue[i].videotitle);
      server.video.videothumbnailUrl.push(newQueue[i].videothumbnailUrl);
    }

    try {
      server.dispatcher.end();
    } catch (e) {}
  }

  static serverQueueExist(message,server) {
      try {
          if (!server.video.queue[0]) {
              message.channel.send("if you want 2 use all options first play something  :)");
              return false;
          }
      } catch (err) {
          message.channel.send("if you want 2 use all options first play something  :)");
          return false;
      }
      return true;
  }

}
