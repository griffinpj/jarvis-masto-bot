import _ from 'lodash';
import config from './config.js';

config();

const apiKey = process.env.GPT_KEY;
const engineId = 'gpt-3.5-turbo';

export const get = () => fetch(`https://api.openai.com/v1/models`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
}).then(response => {
    if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}).then(data => {
    return data;
}).catch(error => {
    console.error('Error:', error);
});

const r = await get();
console.log(JSON.stringify(r));

