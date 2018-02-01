var Discord = require('discord.js');
var client = new Discord.Client();

var config = require('./config.json');

var HelpCommand = require('./commands/help.js');

client.on('ready', () => {
	console.log('Client connected!');
});

var commands = {
	'help': new HelpCommand()
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

client.login(config.token);