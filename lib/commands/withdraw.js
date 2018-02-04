var functions = require('../functions');
var bot = require('../../bot');

function WithdrawCommand() {
}

var p = {};

p.invoke = async function (msg, args) {
    var discord_id = msg.author.id;
    if (args.length <= 2) {
        msg.author.send('```prolog\nError: command is missing arguments```');
    } else if (args.length > 3) {
        msg.author.send('```prolog\nError: too many arguments```');
    } else {
        if (isNaN(parseFloat(args[0]))) {
            msg.author.send('```prolog\nError: ' + args[0] + ' is not a valid <ammount> argument```');
        } else if (['IOTA', 'KIOTA', 'MIOTA', 'GIOTA', 'TIOTA', 'PIOTA'].indexOf(args[1].toUpperCase()) - 1) {
            msg.author.send('```prolog\nError: ' + args[1] + ' is not a valid <iota|kiota|miota|giota|tiota|piota> argument```');
        } else if (!bot.iota.valid.isAddress(args[2])) {
            msg.author.send('```prolog\nError: ' + args[2].toLowerCase() + ' is not a valid <withdrawal address> argument```');
        } else {
            var doesUserExist = await functions.doesUserExist(discord_id);
            if (doesUserExist == "success") {
                //TODO check balance and withdraw
            } else {
                msg.author.send('```prolog\nError: could not find user in database```');
            }
        }
    }
}

WithdrawCommand.prototype = p;

module.exports = WithdrawCommand;