import { configDotenv } from "dotenv";
configDotenv();

import axios from "axios";


const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const GUILD_ID = process.env.DISCORD_SERVER_ID;
const TOKEN = process.env.DISCORD_TOKEN;

const url = `https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`
const json = {
    "name": "compliment",
    "type": 1,
    "description": "Give someone some compliments!",
    "options": [
        {
            "name": "name",
            "description": "The name of whom you want to compliment",
            "type": 3,
            "required": true
        },
        {
            "name": "context",
            "description": "Give some context",
            "type": 3,
            "required": true
        }
    ]
}
const headers = {
    "Authorization": `Bot ${TOKEN}`
}
const r = await axios.post(url, json, {headers: headers});
console.log(r.data);