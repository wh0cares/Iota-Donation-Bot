var functions = require('../functions');
var bot = require('../../bot');

function WithdrawCommand() {
}

var p = {};

p.invoke = async function (msg, args) {
    var discord_id = msg.author.id;
    if (args.length > 2) {
        if (isNaN(parseFloat(args[0]))) {
            msg.author.send('An error has occurred withdrawing your IOTA');
        } else if (['IOTA', 'KIOTA', 'MIOTA', 'GIOTA', 'TIOTA', 'PIOTA'].indexOf(args[1].toUpperCase()) - 1) {
            msg.author.send('An error has occurred withdrawing your IOTA');
        } else if (!bot.iota.valid.isAddress(args[2])) {
            msg.author.send('An error has occurred withdrawing your IOTA');
        } else {
            var doesUserExist = await functions.doesUserExist(discord_id);
            if (doesUserExist == "success") {
                //TODO check balance and withdraw
            } else {
                msg.author.send('An error has occurred withdrawing your IOTA');
            }
        }
    } else {
        msg.author.send('An error has occurred withdrawing your IOTA');
    }
}

WithdrawCommand.prototype = p;

module.exports = WithdrawCommand;