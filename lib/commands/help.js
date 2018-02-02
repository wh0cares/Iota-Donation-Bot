function HelpCommand() {
}

var p = {};

p.invoke = function(msg, args) {
	msg.channel.send({
		embed: {
			color: 3447003,
			title: 'IOTA Donation Bot Help',
			description: 'Parameters enclosed in **<  >** are required while those within **{   }** are optional. \nDo not include these symbols.',
			fields: [
			{
				name: 'Usage',
				value: '**donate balance**: Check the IOTA balance you have stored on the bot\n'
				+ '**donate deposit**: Get a deposit address for IOTA. **IOTA deposit addresses should not be used more than once**\n'
				+ '**donate withdraw <ammount>***: Withdraw IOTA from your donation account.\n'
				+ '**donate send <discord tag> <ammount> <Iota|Kiota|Miota|Giota|Tiota|Piota>***: Donate IOTA from your donation account to someone else.\n'
				+ '**donate help**: Display this help screen\n'
			},
			{
				name: 'Examples',
				value: '**donate send wh0_cares#6199 1 iota**\n'
				+ '**donate send wh0_cares#6199 1 miota**\n'
			}
			]
		}
	});

}

HelpCommand.prototype = p;

module.exports = HelpCommand;