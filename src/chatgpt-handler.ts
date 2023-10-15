import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat";


const openai = new OpenAI({
    apiKey: process.env.CHATGPT_KEY, 
});

const master_chatgpt_conversation = async (name: string, context: string) => {
    const chat_config: ChatCompletionCreateParamsNonStreaming = {
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": initial_prompt(name, context) }],
    };

    let response = await openai.chat.completions.create(chat_config);
    const message = response.choices[0].message;
    chat_config.messages.push(message);
    chat_config.messages.push({ "role": "user", "content": next_prompt });
    return {chat_config, message};
}

const subsequent_chatgpt_conversation = async (chat_config: ChatCompletionCreateParamsNonStreaming) => {
    let response = await openai.chat.completions.create(chat_config);
    const message = response.choices[0].message;
    chat_config.messages.push(message);
    chat_config.messages.push({ "role": "user", "content": next_prompt });
    return {chat_config, message};  
}
export { master_chatgpt_conversation, subsequent_chatgpt_conversation };

const initial_prompt = (name: string, context: string) => {
    return `You are a compliment bot. Give a supper funny, super silly, and maybe comforting compliment according to the user's name and context.
    The user's name is ${name}. The context is that ${context}. Give me the plain text only without quotes or double quotes so that I can send to them directly.`
}

const next_prompt = `Good, give me another one`