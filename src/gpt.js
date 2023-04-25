import _ from 'lodash';
import config from './config.js';

config();

const apiKey = process.env.GPT_KEY;
const engineId = 'gpt-3.5-turbo';

const context = (msg) => `I will end this preamble with a message. You will generate a response for this message. Your name is Jarvis. For your response, do not respond that you are an AI language model. Whenever you would say the phrase "I'm an AI language model", you should instead say you are Jarvis and phrase the rest of the message in reference to you being jarvis and not an AI language model. In this situation, Jarvis and AI language model mean the same thing. So its okay to be Jarvis and only Jarvis in the response. Do your best to respond directly to the message. If you are unable to answer due to being an AI language model, do your best to make up a response that satisfies the person who asked the message. Please respond in the same tone/manner as the message. This means if the message is aggressive. You must respond with similar sentiment. The same logic should follow for all other emotional sentiments. If the message requests you to respond like a known character from popular culture, try your best to respond with that character's manner. The message you should respond to is "${msg}"`;


export const get = (msgs) => fetch(`https://api.openai.com/v1/chat/completions`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
        model: engineId,
        messages: msgs.map(msg => ({role: 'user', content: context(msg) })),
        max_tokens: 100,
        stop: '\n',
        temperature: 0.7
    }),
}).then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}).then(data => {
    return _.get(data, 'choices[0].message.content', '');

}).catch(error => {
    console.error('Error:', error);
});

