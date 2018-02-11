var functions = require('../functions');
var bot = require('../../bot');

function SendCommand() {
}

var p = {};

p.invoke = async function (msg, args) {
    var discord_id = msg.author.id;
    if (args.length <= 2) {
        msg.author.send('```prolog\nError: command is missing arguments```');
    } else if (args.length > 3) {
        msg.author.send('```prolog\nError: too many arguments```');
    } else {
        // if (!bot.iota.valid.isAddress(args[0])) {
        //     msg.author.send('```prolog\nError: ' + args[0].toLowerCase() + ' is not a valid <discord tag> argument```');
        // } else 
        //TODO
        //Check if valid discord tag
        if (isNaN(parseFloat(args[1]))) {
            msg.author.send('```prolog\nError: ' + args[1] + ' is not a valid <ammount> argument```');
        } else if (['IOTA', 'KIOTA', 'MIOTA', 'GIOTA', 'TIOTA', 'PIOTA'].indexOf(args[2].toUpperCase()) < 0) {
            msg.author.send('```prolog\nError: ' + args[2].toUpperCase() + ' is not a valid <iota|kiota|miota|giota|tiota|piota> argument```');
        } else {
            var doesUserExist = await functions.doesUserExist(discord_id);
            if (doesUserExist == "success") {
                var fromUnit;
                if (args[2].length == 4) {
                    fromUnit = args[2].substring(0, 1)
                    fromUnit = fromUnit.toLowerCase();
                } else {
                    fromUnit = args[2].substring(0, 2)
                    fromUnit = fromUnit.charAt(0).toUpperCase() + fromUnit.substr(1).toLowerCase();
                }
                sendAmount = bot.iota.utils.convertUnits(args[1], fromUnit, 'i');
                var balance = await functions.getUserBalance(discord_id);
                if (balance[0] == "success") {
                    if (sendAmount <= balance[1]) {
                        var send = await functions.sendIota(discord_id, args[0], sendAmount);
                        if (send[0] == "success") {
                            //TODO
                            //Send success message
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

SendCommand.prototype = p;

module.exports = SendCommand;