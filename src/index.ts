import "dotenv/config.js";

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { Collection } from 'discord.js';
import { Command } from './interfaces/command';
import ComplimentCommand from './commands/compliment.js';




// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token

const token = process.env.DISCORD_TOKEN;
console.log(token);
// log current directory
client.login(token);


// load commands
const commands: Collection<string, Command> = new Collection();
commands.set('compliment', ComplimentCommand);

// route commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});