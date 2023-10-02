import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/command";
const ComplimentCommand : Command = {
    data: new SlashCommandBuilder()
        .setName('compliment')
        .setDescription('Compliment someone!'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        await interaction.reply('You are awesome!');
    }
}

export default ComplimentCommand;