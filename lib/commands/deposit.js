var functions = require('../functions');

function DepositCommand() {
}

var p = {};

p.invoke = async function (msg, args) {
    var discord_id = msg.author.id;
    var doesUserExist = await functions.doesUserExist(discord_id);
    if (doesUserExist == "success") {
        var address = await functions.getNewIotaAddress(discord_id);
        if (address[0] == "success") {
            msg.author.send('**Deposit IOTA to this address:** ' + address[1] + "\n**Do not deposit to the same address more than once.**");
            //TODO
            //Check if user deposited iota with iota.api.getInputs
        }else{
            msg.author.send('```prolog\nError: could not generate new iota address```');
        }
    } else {
        msg.author.send('```prolog\nError: could not find user in database```');
    }
}

DepositCommand.prototype = p;

module.exports = DepositCommand;