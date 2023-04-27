import _ from 'lodash';
import config from './config.js';

config();

const apiKey = process.env.GPT_KEY;
const engineId = 'gpt-3.5-turbo';

export const get = (msgs) => fetch(`https://api.openai.com/v1/chat/completions`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
        model: engineId,
        messages: msgs,
        max_tokens: 450,
        temperature: 0.8
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

