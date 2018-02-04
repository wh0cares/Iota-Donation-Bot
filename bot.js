var Discord = require('discord.js');
var config = require('./config.json');
var client = new Discord.Client();
var IOTA = require('iota.lib.js');

var HelpCommand = require('./lib/commands/help');
var BalanceCommand = require('./lib/commands/balance');
var DepositCommand = require('./lib/commands/deposit');
var WithdrawCommand = require('./lib/commands/withdraw');

var iota = new IOTA({
	'host': config.iota.host,
	'port': config.iota.port
});

client.on('ready', () => {
	console.log('Client connected!');
});

var commands = {
	'help': new HelpCommand(),
	'balance': new BalanceCommand(),
	'deposit': new DepositCommand(),
	'withdraw': new WithdrawCommand()
}

client.on('message', message => {
	var responders = ['!donate', '!tip'];

	if (message.author.bot) return;

	var found = false;
	for (var x of responders) {
		if (message.content.startsWith(x)) {
			found = true;
			break;
		}
	}

	if (!found) return;

	var split = message.content.split(' ');
	if (split.length <= 1) return;
	var command = split[1].toLowerCase();
	var args = split.slice(2);

	console.log(command, args);

	if (commands.hasOwnProperty(command)) {
		var cmd = commands[command];

		cmd.invoke(message, args);
	}
});
module.exports.iota = iota;
client.login(config.discord.token);