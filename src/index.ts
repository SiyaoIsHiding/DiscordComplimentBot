import "dotenv/config.js";
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { Collection } from 'discord.js';
import { Command } from './interfaces/command';
import ComplimentCommand, { register_worker } from './commands/compliment.js';

// Create a new client instance
const master_bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const jane_bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const mike_bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const jade_bot = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
master_bot.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
const master_token = process.env.DISCORD_MASTER_TOKEN;
master_bot.login(master_token);

const jane_token = process.env.DISCORD_JANE_TOKEN;
jane_bot.login(jane_token).then(() => {
	register_worker('jane', jane_bot);
});

const mike_token = process.env.DISCORD_MIKE_TOKEN;
mike_bot.login(mike_token).then(() => {
	register_worker('mike', mike_bot);
});

const jade_token = process.env.DISCORD_JADE_TOKEN;
jade_bot.login(jade_token).then(() => {
	register_worker('jade', jade_bot);
});


// load commands
const commands: Collection<string, Command> = new Collection();
commands.set('compliment', ComplimentCommand);

// route commands
master_bot.on(Events.InteractionCreate, async interaction => {
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