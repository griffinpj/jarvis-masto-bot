import { login } from 'masto';
import logger from './logger.js';
import * as gpt from './gpt.js';
import redis from './redis.js';
import context from './systemContext.js';
import utils from './utils.js';
import mastodon from './masto.js';


const stream = await mastodon.stream.user({
    include_types: ['mention']
});

logger.info('Jarvis is listening at @jarvis@social.griff.la ...');
stream
    .on('notification', async (message) => {
        logger.info('Processing Message');
        console.log(message);
        if (message.type === 'mention' && message.account && message.status) {
            // Get the user who mentioned your bot
            const isMentioned = message
                .status
                .mentions.find(mention => mention.acct === 'jarvis');
                
            const user = utils.extractUserTag(message.account.url) || `@${message.account.username}`;
            const redisKey = 'jarvis-masto-bot' + user;
            const msg = utils.decodeHtmlSymbols(utils.removeHtmlTags(message.status.content)) 
                || message.status.content ;

            logger.info(`Recieved from '${user}': ${msg}`);
            if (isMentioned && user !== '@jarvis@social.griff.la' && user !== '@jarvis') {
                let msgs = [];
                try {
                    const redisMsgs = await redis.get(redisKey);
                    msgs = msgs ? JSON.parse(redisMsgs) : [];
                } catch (e) {
                    logger.error('Failed to process redis storage for ' + user);
                    logger.error(e);
                }

                if (!msgs || msgs.length === 0) {
                    // Add the system message as the first message
                    // Gives the initial behavior guidelines
                    msgs = [context]; 
                }

                // Add the new message to the saved conversation from redis
                msgs.push({
                    role: 'user',
                    content: msg
                });

                // Retrieve Jarvis's next response
                let gptMessage = await gpt.get(msgs);
                if (!gptMessage) {
                    // Trim msgs array and try again
                    msgs = utils.trimMsgs(msgs);
                    gptMessage = await gpt.get(msgs);
                }

                // reset msgs
                if (!gptMessage) {
                    logger.error('Resetting msgs');
                    msgs = [context];
                } 


                msgs.push({
                    role: 'assistant',
                    content: gptMessage || ''
                });

                let savedMsgs = '';
                try {
                    savedMsgs = JSON.stringify(msgs);
                } catch (e) {
                    logger.error('Failed to stringify messages to redis for ' + user);
                    logger.error(e);
                }
                await redis.set(redisKey, savedMsgs);

                if (gptMessage) {
                    logger.info('Saved msgs for ' + redisKey);
                    logger.info('Request Input Length: ' +
                        msgs.reduce((acc, m) => (m.content && m.content.length ? m.content.length : 0) + acc, 0)
                    );
                    
                    const replyMessage = (`${user} ${gptMessage}`).slice(0, 500);
                    logger.info('Generated response: ' + replyMessage);
                    
                    // Reply message with a mention of the user who mentioned your bot
                    await mastodon.status.create({ 
                        status: replyMessage, 
                        inReplyToId: message.status.id 
                    });
                }
            } else {
                logger.error('Message not processed. No valid mentions');
                console.log(message);
            }
        }
    })
    .on('error', (error) => {
        logger.error(error);
    });



