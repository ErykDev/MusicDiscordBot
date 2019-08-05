const Command = require('./Command');


module.exports = class Order66Command extends Command{

  execute(message){
    super.execute(message,Command.ORDER66());

    Command.logWarn(`Executing order66`);

    process.exit(1);
  }
}
