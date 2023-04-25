import { login } from 'masto';
import config from './config.js';
import logger from './logger.js';
import * as gpt from './gpt.js';

config();

const USER_POST_STREAM = 'streaming/user';

const masto = await login({
    url: process.env.MASTODON_URL,
    accessToken: process.env.MASTODON_TOKEN,
});


const handleMessage = async (message) => {
    if (message.type === 'mention') {
        //logger.info('Processing message: ', message.content);
        // Get the status of the user who mentioned your bot

        // Get the user who mentioned your bot
        const isMentioned = message
            .status
            .mentions.find(mention => mention.acct === 'jarvis');

        if (isMentioned) {
            // Construct your reply message
            const gptMessage = await gpt.get([message.status.content]);
            const replyMessage = `@${message.account.username} ${gptMessage}`;

            logger.info('Generated Jarvis Response: ', replyMessage);
            // Reply message with a mention of the user who mentioned your bot
            await masto.v1.statuses.create({ 
                status: replyMessage, 
                inReplyToId: message.status.id 
            });
        }
        
    }
};

const stream = await masto.v1.stream.streamUser({
    include_types: ['mention']
});

logger.info('Listening for mentions...');
stream
    .on('notification', handleMessage)
    .on('error', (error) => {
        logger.error(error);
    });



