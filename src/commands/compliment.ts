import { CacheType, ChatInputCommandInteraction, Client, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../interfaces/command";
import { master_chatgpt_conversation, subsequent_chatgpt_conversation } from "../chatgpt-handler.js";
const workers: Record<string, Client<boolean>> = {};

const ComplimentCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('compliment')
        .setDescription('Compliment someone!'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        try {
            let name = interaction.options.getString('name')!;
            let context = interaction.options.getString('context')!;
            let { chat_config: chatgpt, message } = await master_chatgpt_conversation(name, context);
            interaction.reply(trim(message.content));

            let channel = interaction.channel.id;
            for (let key in workers) {
                // if the worker is also in the channel, send message
                if (workers[key].channels.cache.has(channel)) {
                    let { chat_config: _, message } = await subsequent_chatgpt_conversation(chatgpt);
                    (workers[key].channels.cache.get(channel)! as TextChannel)
                        .send(trim(message.content));
                }
            }
        } catch (e) {
            interaction.reply("Error. Bot author may need funding to continue service.");
        }
    }
}

function trim(s: string) {
    if (s.startsWith('"') && s.endsWith('"')) {
        s = s.slice(1, -1);
    }
    return s;
}
export function register_worker(name: string, client: Client<boolean>) {
    workers[name] = client;
}
export default ComplimentCommand;