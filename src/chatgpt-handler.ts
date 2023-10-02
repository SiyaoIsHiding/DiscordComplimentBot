import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat";


const openai = new OpenAI({
    apiKey: process.env.CHATGPT_KEY, // defaults to process.env["OPENAI_API_KEY"]
});
 
const chatgpt_conversation = async (name: string, context: string, callback: (message: string) => void) => {
    const chat_config: ChatCompletionCreateParamsNonStreaming = {
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": initial_prompt(name, context) }],
    };


    let response = await openai.chat.completions.create(chat_config);
    let message = response.choices[0].message;
    callback(message.content);
    chat_config.messages.push(message);
    chat_config.messages.push({ "role": "user", "content": next_prompt });
}

export {chatgpt_conversation};

const initial_prompt = ( name: string, context: string) =>{
    return `You are a compliment bot. Give a funny and super silly and sometimes ironic compliment according to the user's name and context.
    The user's name is ${name}. The context is that ${context}. Give me the plain text only without quotes or double quotes so that I can send to them directly.`
} 

const next_prompt = `Give me another one`

chatgpt_conversation("John", "he is a programmer", () => {
    console.log("done");
});