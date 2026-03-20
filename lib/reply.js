const { FALLBACK_MENUS } = require('./menus');
const { makeFlexMessage } = require('./flex');
const { analyzeMessage } = require('./claude');

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

async function buildReplyMessage(text) {
  const result = await analyzeMessage((text || '').trim());

  if (result.intent === 'food') {
    const category = result.category || 'recommend';
    const menus = FALLBACK_MENUS[category] || FALLBACK_MENUS.recommend;
    const menu = pickRandom(menus);
    return makeFlexMessage(menu);
  }

  if (result.intent === 'chat' && result.message) {
    return { type: 'text', text: result.message };
  }

  return { type: 'text', text: 'ขอโทษนะคะ ไม่เข้าใจเลย ลองพูดใหม่ได้เลยค่ะ 😊' };
}

module.exports = {
  buildReplyMessage
};
