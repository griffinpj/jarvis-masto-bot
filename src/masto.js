import { login } from 'masto';
import logger from './logger.js';
import config from './config.js';

config();

const masto = await login({
    url: process.env.MASTODON_URL,
    accessToken: process.env.MASTODON_TOKEN,
    disableVersionCheck: true
});

const mastodon = {};

mastodon.stream = {
    user: async (options) => masto.v1.stream.streamUser(options)
};

mastodon.status = {
    create: (options) => masto.v1.statuses.create(options)
}

export default mastodon;
