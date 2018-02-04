function HelpCommand() {
}

var p = {};

p.invoke = function(msg, args) {
	msg.channel.send('__**IOTA Donation Bot Help**__ \
	\nParameters enclosed in **<  >** are required while those within **{   }** are optional. Do not include these symbols. \
	\n\nUsage: \
	\n**donate balance**: Check the IOTA balance you have stored on the bot \
	\n**donate deposit**: Get a deposit address for IOTA. **IOTA deposit addresses should not be used more than once** \
	\n**donate withdraw <ammount> <Iota|Kiota|Miota|Giota|Tiota|Piota> <withdrawal address>**: Withdraw IOTA from your donation account. \
	\n**donate send <discord tag> <ammount> <Iota|Kiota|Miota|Giota|Tiota|Piota>**: Donate IOTA from your donation account to someone else. \
	\n**donate help**: Display this help screen \
	\n\nExamples: \
	\n**donate balance** \
	\n**donate deposit** \
	\n**donate withdraw 1 miota BMDXKVTZZDFAESOWISVTGWBFKILLJLABPGPB9MUMQPMMSKFQEIXYKFESZMAX9LOKMYHBHYGUKFECK9NCYNSFTEQNVD** \
	\n**donate send wh0_cares#6199 1 miota** \
	\n**donate help**\n');
}

HelpCommand.prototype = p;

module.exports = HelpCommand;