const { FALLBACK_MENUS } = require('./menus');
const { makeFlexMessage } = require('./flex');
const { analyzeMessage } = require('./gemini');

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function keywordFallback(text) {
  const t = text.toLowerCase();
  if (/หิว|腹減|腹|배고|배|배고|hungry/.test(t) || t.includes('หิว')) {
    return { intent: 'food', category: 'hungry' };
  }
  if (/กินอะไร|จะกิน|กิ๋น|กิ้น|กิน|ทานอะไร|อยากกิน/.test(t)) {
    return { intent: 'food', category: 'whatToEat' };
  }
  if (/แนะนำ|recommend|suggest|มีอะไร/.test(t)) {
    return { intent: 'food', category: 'recommend' };
  }
  return null;
}

async function buildReplyMessage(text) {
  const trimmed = (text || '').trim();
  let result = null;

  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 5000)
    );
    result = await Promise.race([analyzeMessage(trimmed), timeout]);
  } catch (e) {
    console.log('Gemini unavailable, using keyword fallback:', e.message);
    result = keywordFallback(trimmed);
  }

  if (result && result.intent === 'food') {
    const category = result.category || 'recommend';
    const menus = FALLBACK_MENUS[category] || FALLBACK_MENUS.recommend;
    const menu = pickRandom(menus);
    return makeFlexMessage(menu);
  }

  if (result && result.intent === 'chat' && result.message) {
    return { type: 'text', text: result.message };
  }

  return { type: 'text', text: 'ขอโทษนะคะ ไม่เข้าใจเลย ลองพูดใหม่ได้เลยค่ะ 😊' };
}

module.exports = {
  buildReplyMessage
};
