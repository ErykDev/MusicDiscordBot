module.exports = class TextUtils{

  static htmlToString(html) {
      html = html.replace(/<br>/gi, "\n");
      html = html.replace(/<p.*>/gi, "\n");
      html = html.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, "$2"); //$2 (Link->$1)
      html = html.replace(/<(?:.|\s)*?>/g, "");
      return html;
  }

  static countWords(s) {
      s = s.replace(/(^\s*)|(\s*$)/gi, "");//exclude  start and end white-space
      s = s.replace(/[ ]{2,}/gi, " ");//2 or more space to 1
      s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
      return s.split(' ').length;
  }

  static calculatePrefixLenght(command, message) {
    return message.content.indexOf(command);
  }

  static isYoutubeLink(str) {

    String.prototype.contains = function (test) {
        return this.indexOf(test) == -1 ? false : true;
    };

      return (
        str.toString().contains("youtube.com") ||
        str.toString().contains("youtu.be")
      );
  }

  static descriptonCheacker(obj) {
      if (obj.toString().length < 10000) {

          var text = TextUtils.htmlToString(obj);

          if (TextUtils.countWords(text) < 1000) {
              return text;
          } else {
              return "Jesus how long description i'm 2 busy :<";
          }

      } else {
          return "Jesus how long description i'm 2 busy :<";
      }
  }
}
