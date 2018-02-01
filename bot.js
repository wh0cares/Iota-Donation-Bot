var Discord = require('discord.js');
var config = require('./config.json');
var client = new Discord.Client();

var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connection = ('postgres://%s:%s@%s:%d/%s', config.postgresql.username, config.postgresql.password, config.postgresql.host, config.postgresql.port, config.postgresql.database);
var db = pgp(connection);
var HelpCommand = require('./commands/help');
var BalanceCommand = require('./commands/balance');

client.on('ready', () => {
	console.log('Client connected!');
});

var commands = {
	'help': new HelpCommand(),
	'balance': new BalanceCommand()
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

client.login(config.discord.token);