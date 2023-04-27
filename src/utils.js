import context from './systemContext.js';

const utils = {};

const CONTENT_RATE_LIMIT = 23;

utils.extractUserTag = (url) => {
  const [domain, userTag] = url.slice(8).split('/');
  return `${userTag}@${domain}`;
};

utils.removeHtmlTags = (str) => {
  return str.replace(/(<([^>]+)>)/gi, "");
}

utils.decodeHtmlSymbols = (str) => {
    const htmlEntities = {
        "&#39;": "'",
        "&quot;": "\"",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&nbsp;": " ",
    };
    return str.replace(/&#?\w+;/g, match => htmlEntities[match] || match);
}

utils.trimMsgs = (msgs) => {
    const calculateCount = msgs => msgs.reduce((acc, m) => 
        (m.content && m.content.length ? m.content.length : 0) + acc, 0) || 0;

    if (Number(calculateCount(msgs)) > CONTENT_RATE_LIMIT) {
        return [context, ...(msgs.reduce((acc, msg) => {
            if (Number(calculateCount(acc)) >= CONTENT_RATE_LIMIT) {
                // pop call and response
                acc.pop();
                acc.pop();
            } 
            return acc;
        }, msgs.slice(1).reverse()).reverse())];
    }

    return [context];
};

export default utils;
// const arr = [
//     {
//         role: 'assistant',
//         content: 'context',
//     },
//     {
//         role: 'user',
//         content: '123131321231412341231241234123'
//     },
//     {
//         role: 'assistant',
//         content: 'context',
//     },
//     {
//         role: 'user',
//         content: '41231241234123'
//     }
// ];

// console.log(utils.trimMsgs(arr));


