import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/command";
import { chatgpt_conversation } from "../chatgpt-handler.js";
const ComplimentCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('compliment')
        .setDescription('Compliment someone!'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        try {
            let name = interaction.options.getString('name')!;
            let string = interaction.options.getString('context')!;
            chatgpt_conversation(interaction.options.getString('name')!, interaction.options.getString('context')!, (message: string) => {
                interaction.reply(message);
            });
        }catch(e){
            interaction.reply("Error. Bot author may need funding to continue service.");
        }
    }
}

export default ComplimentCommand;