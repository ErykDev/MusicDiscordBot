const Command = require('./Command');


module.exports = class AutismCommand extends Command{

  execute(message){
    super.execute(message, Command.AUTISM());

    var spiners = [
        "https://media.giphy.com/media/5xdLGTraommk0/source.gif",
        "https://media.giphy.com/media/14mHZ9JSXD7Ja8/source.gif",
        "https://media.giphy.com/media/1Ubrzxvik2puE/giphy.gif",
        "http://blitz.arc.unsw.edu.au/wp-content/uploads/2017/05/Hand_Spinners_-_Fidget_Toys.mp4_1488522331.gif",
        "http://imgur.com/ExOdjuV",
        "https://imgur.com/RhCMhdI",
        "https://i.embed.ly/1/display/resize?width=800&height=800&key=3e750996b20f47be9451da09d3fffa5b&url=https%3A%2F%2Fj.gifs.com%2FAnZ96p.gif",
        "http://0.media.dorkly.cvcdn.com/20/80/4fcaa14e1215f43b4b791419dca027d9.gif",
        "https://imgur.com/BJdzwUz"
    ];

    var lot = spiners[Math.floor(Math.random() * spiners.length)];

    //message.channel.send("Some medicaments went to" + " " + message.author);

    Command.logInfo(`Sending spinner to ${message.author}`);

    message.author.send(lot);
    message.author.send(message.author + " " + "enjoy :)");
  }
}
