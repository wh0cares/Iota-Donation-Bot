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
    // functions.doesUserExist(discord_id);
    var balance = await functions.getUserBalance(discord_id);
    var toUnit;
    if (balance < 1000){
        toUnit = 'i';
    }else if (balance >= 1000 && balance < 1000000){
        toUnit = 'Ki';
    }else if (balance >= 1000000 && balance < 1000000000){
        toUnit = 'Mi';
    }else if (balance >= 1000000000 && balance < 1000000000000){
        toUnit = 'Gi';
    }else if (balance >= 1000000000000 && balance < 1000000000000000){
        toUnit = 'Ti';
    }else if (balance >= 1000000000000000){
        toUnit = 'Pi';
    }
    balance = iota.utils.convertUnits(balance, 'i', toUnit);
    msg.author.send('**Balance:** ' + balance + ' '+ toUnit.toUpperCase() + 'OTA');
}

BalanceCommand.prototype = p;

module.exports = BalanceCommand;