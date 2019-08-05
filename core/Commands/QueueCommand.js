const Command = require('./Command');
const Discord = require("discord.js");
const QueueUtils = require('../QueueUtils');


module.exports = class QueueCommand extends Command{

  QueueCommand(ServerDJRanks){
    this.ServerDJRanks = ServerDJRanks;
  }

  execute(message,server, prefixLenght){
    super.execute(message, Command.QUEUE());

    var agrs = message.content.substring(prefixLenght).split(" ");

    if (typeof ServerControlerId === 'undefined') {
      buildAndSend();
    } else if (ServerDJRanks.split(";").some(x => message.member.roles.has(x))) {
      buildAndSend();
    } else {
        message.reply(" you don't have permison to do that :grimacing: ");
    }

    function buildAndSend(){
      if (!(QueueUtils.serverQueueExist(message,server))) {
          return;
      }

      if (!server.video.queue[0]) {
          message.channel.send("queue is empty :(");
          return;
      }

      if (agrs[1] && agrs[2]) {
          if (agrs[1] = "site") {
              var maksymus = Math.floor(server.video.queue.length / 20) / 1;

              if (isNaN(agrs[2])) {
                  message.channel.send("if you want to see rest of the queue type: &&queue site <0-" + maksymus + ">");
                  return;
              }
              if (parseInt(agrs[2]) > maksymus) {
                  message.channel.send("unexpected syntax now you can couce from <0-" + maksymus + ">");
                  return;
              } else {
                  var u = parseInt(agrs[2]) * 20;
                  //console.log(u);
                  var res = [];

                  while (u < server.video.queue.length) {
                      videoinfoloop(u,res);
                      u++;
                  }
                  // console.log("server.video.queue[u] == server.video.queue.length");
                  var jjj = res.toString();
                  var heheboii = jjj.replace(/,/g, "");

                  //console.log(jjj);
                  var embed = new Discord.RichEmbed()
                      .setDescription(heheboii)
                      .setColor("7f0c0c")
                  message.channel.sendEmbed(embed);
                  return;
              }
          } else {
              message.channel.send("unexpected syntax");
              return;
          }
      }

      if (server.video.queue[0] && !server.video.queue[1]) {
          var embed = new Discord.RichEmbed()
              .setThumbnail(server.video.videothumbnailUrl[0])
              .setDescription(":robot:" + '**' + "NoW playing :" + " " + server.video.videotitle[0] + " " + "**" + "\n" + "https://youtu.be/" + server.video.queue[0] + "\n")
              .setColor("7f0c0c")
          message.channel.sendEmbed(embed);
          return;
      }

      if (server.video.queue.length > 20) {
          if (server.video.queue && server.video.queue.length) {

              var u = 0;
              //console.log(u);
              var res = [];
              while (u < 20) {
                  videoinfoloop(u,res);
                  u++;
              }
              // console.log("server.video.queue[u] == server.video.queue.length");
              var jjj = res.toString();
              var heheboii = jjj.replace(/,/g, "");
              //  Math.round(server.video.queue.length / 20) / 0;
              var sites = Math.floor(server.video.queue.length / 20) / 1;

              //console.log(jjj);
              var embed = new Discord.RichEmbed()
                  .setDescription(heheboii + "\n  if you want to see rest of the queue type: &&queue site <number> \n now eneable: <0-" + sites + ">site(s)")
                  .setColor("7f0c0c")
              message.channel.sendEmbed(embed);
              return;
          }
      }
      if (server.video.queue.length <= 20) {

          if (server.video.queue && server.video.queue.length) {
              var u = 0;
              //console.log(u);
              var res = [];
              while (u < server.video.queue.length) {
                  videoinfoloop(u,res);
                  u++;
              }
              // console.log("server.video.queue[u] == server.video.queue.length");
              var jjj = res.toString();
              var heheboii = jjj.replace(/,/g, "");
              //console.log(jjj);
              var embed = new Discord.RichEmbed()
                  .setDescription(heheboii)
                  .setColor("7f0c0c")
              message.channel.sendEmbed(embed);
              return;
          }
      }
      return;
    }

    function videoinfoloop(u, res) {
        //console.log(res.length);
        var ghg;
        if (u === 0)
            ghg = '**' + "NoW Playing: " + server.video.videotitle[u] + " " + '**' + "\n";
        else
            ghg = '**' + (u + 1) + ". " + server.video.videotitle[u] + " " + '**' + "\n";
        res.push(ghg);
        //return ghg;
    }

    function sitesloop(sites) {
        var stri = "";
        for (var g = 0; g > sites; g++) {
            stri += g + " "
        }
        return stri;
    }
  }
}
