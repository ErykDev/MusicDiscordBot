const YTDL = require("ytdl-core");
const request = require("request");
const isPlaylist = require("is-playlist");
const TextUtils = require('./TextUtils');
const getYouTubeID = require("get-youtube-id");

module.exports = class YTLoader{

  static search_video(yt_api_key,query, callback) {
      request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q="+encodeURIComponent(query)+"&key="+yt_api_key, function (error, response, body) {
          var json = JSON.parse(body);
          if (!json.items[0]) callback("3_-a9nVZYjk");
          else {
              callback(json.items[0].id.videoId);
          }
      });
  }

  static getID(yt_api_key, str, cb) {
      const regex = /(?:youtube\.com.*(?:\?|&)(?:list)=)((?!videoseries)[a-zA-Z0-9_-]*)/g;
      var odpp = str.toString().replace(",", "");

      if (isPlaylist(odpp)) {
          const str = odpp;
          let m;
          var PlayilstId;
          while ((m = regex.exec(str)) !== null) {
              if (m.index === regex.lastIndex) {
                  regex.lastIndex++;
              }
              m.forEach((match, groupIndex) => {
                  if (groupIndex = 1) {
                      PlayilstId = `${match}`;
                  }
              });
          }
          cb({ id: PlayilstId, isitPlaylist: true });
          return;
      } else if (TextUtils.isYoutubeLink(odpp)) {
          cb({ id: getYouTubeID(str), isitPlaylist: false });
      } else {
          YTLoader.search_video(yt_api_key,str, function (id) {
                cb({ id: id, isitPlaylist: false });
          });
      }
  }
}
