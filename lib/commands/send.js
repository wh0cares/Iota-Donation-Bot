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
        if (msg.mentions.members.size == 0) {
            msg.author.send('```prolog\nError: <discord mention> argument is missing```');
        } else if (isNaN(parseFloat(args[1]))) {
            msg.author.send('```prolog\nError: ' + args[1] + ' is not a valid <ammount> argument```');
        } else if (['IOTA', 'KIOTA', 'MIOTA', 'GIOTA', 'TIOTA', 'PIOTA'].indexOf(args[2].toUpperCase()) < 0) {
            msg.author.send('```prolog\nError: ' + args[2].toUpperCase() + ' is not a valid <iota|kiota|miota|giota|tiota|piota> argument```');
        } else {
            var doesUserExist = await functions.doesUserExist(discord_id, msg.mentions.members.first().id);
            if (doesUserExist == "success") {
                var doesUserExist = await functions.doesUserExist(msg.mentions.members.first().id);
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
                            var send = await functions.sendIota(discord_id, msg.mentions.members.first().id, sendAmount);
                            if (send[0] == "success") {
                                msg.channel.send('**Send:** ' + args[1] + ' ' + args[2] + ' sent to ' + args[0] + ' https://thetangle.org/transaction/' + send[1]);
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
            } else {
                msg.author.send('```prolog\nError: could not find user in database```');
            }
        }
    }
}

SendCommand.prototype = p;

module.exports = SendCommand;