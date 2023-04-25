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


const extractUserTag = (url) => {
  const [domain, userTag] = url.slice(8).split('/');
  return `${userTag}@${domain}`;
};


const handleMessage = async (message) => {
    if (message.type === 'mention' && message.account && message.status) {
        // Get the user who mentioned your bot
        const isMentioned = message
            .status
            .mentions.find(mention => mention.acct === 'jarvis');

        const user = extractUserTag(message.account.url) || `@${message.account.username}`;
        if (isMentioned && user !== '@jarvis@social.griff.la' && user !== '@jarvis') {
            // Construct your reply message
            const gptMessage = await gpt.get([message.status.content]);
            logger.info('Message recieved from: ' + user)
            const replyMessage = `${user} ${gptMessage}`;

            logger.info('Generated response: ' + replyMessage);
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

logger.info('Jarvis is listening at @jarvis@social.griff.la ...');
stream
    .on('notification', handleMessage)
    .on('error', (error) => {
        logger.error(error);
    });



