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
        } else if (['IOTA', 'KIOTA', 'MIOTA', 'GIOTA', 'TIOTA', 'PIOTA'].indexOf(args[1].toUpperCase()) < 0) {
            msg.author.send('```prolog\nError: ' + args[1].toUpperCase() + ' is not a valid <iota|kiota|miota|giota|tiota|piota> argument```');
        } else if (!bot.iota.valid.isAddress(args[2])) {
            msg.author.send('```prolog\nError: ' + args[2].toLowerCase() + ' is not a valid <withdrawal address> argument```');
        } else {
            var doesUserExist = await functions.doesUserExist(discord_id);
            if (doesUserExist == "success") {
                var fromUnit;
                if (args[1].length == 4) {
                    fromUnit = args[1].substring(0, 1)
                    fromUnit = fromUnit.toLowerCase();
                } else {
                    fromUnit = args[1].substring(0, 2)
                    fromUnit = fromUnit.charAt(0).toUpperCase() + fromUnit.substr(1).toLowerCase();
                }
                withdrawAmount = bot.iota.utils.convertUnits(args[0], fromUnit, 'i')
                var balance = await functions.getUserBalance(discord_id);
                if (balance[0] == "success") {
                    if (withdrawAmount <= balance[1]) {
                        var withdraw = await functions.withdrawIota(discord_id, args[2], withdrawAmount);
                        if (withdraw[0] == "success") {
                            msg.author.send('**Withdraw:** Withdraw has been processed. https://thetangle.org/address/' + args[2]);
                        } else {
                            msg.author.send('```prolog\nError: could not generate new iota address```');
                        }
                    } else {
                        msg.author.send('```prolog\nError: insufficient balance```');
                    }
                } else {
                    msg.author.send('```prolog\nError: could not find users balance in database```');
                }
            } else {
                msg.author.send('```prolog\nError: could not find user in database```');
            }
        }
    }
}

WithdrawCommand.prototype = p;

module.exports = WithdrawCommand;