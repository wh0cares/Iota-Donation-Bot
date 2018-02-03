var functions = require('../functions');
var IOTA = require('iota.lib.js');

function BalanceCommand() {
}

var p = {};

var iota = new IOTA({
    'host': 'http://localhost',
    'port': 14265
});

p.invoke = async function (msg, args) {
    var discord_id = msg.author.id;
    var doesUserExist = await functions.doesUserExist(discord_id);
    if (doesUserExist == "success") {
        var balance = await functions.getUserBalance(discord_id);
        if (balance[0] == "success") {
            var toUnit;
            balance = balance[1];
            if (balance < 1000) {
                toUnit = 'i';
            } else if (balance >= 1000 && balance < 1000000) {
                toUnit = 'Ki';
            } else if (balance >= 1000000 && balance < 1000000000) {
                toUnit = 'Mi';
            } else if (balance >= 1000000000 && balance < 1000000000000) {
                toUnit = 'Gi';
            } else if (balance >= 1000000000000 && balance < 1000000000000000) {
                toUnit = 'Ti';
            } else if (balance >= 1000000000000000) {
                toUnit = 'Pi';
            }
            balance = iota.utils.convertUnits(balance, 'i', toUnit);
            msg.author.send('**Balance:** ' + balance + ' ' + toUnit.toUpperCase() + 'OTA');
        }else{
            msg.author.send('An error has occurred getting your balance');
        }
    } else {
        msg.author.send('An error has occurred getting your balance');
    }
}

BalanceCommand.prototype = p;

module.exports = BalanceCommand;