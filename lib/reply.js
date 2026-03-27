const { FALLBACK_MENUS } = require('./menus');
const { makeCarousel, QUICK_REPLY } = require('./flex');
const { analyzeMessage } = require('./gemini');

const FOOD_KEYWORDS = /หิว|hungry|กิน|ทาน|อาหาร|เมนู|ข้าว|ก๋วยเตี๋ยว|ผัด|ต้ม|แกง|ยำ|สลัด|แนะนำ|recommend|suggest|มีอะไร|จะกิน|อยากกิน|ทานอะไร|กิ๋น|กิ้น|food|meal|eat|lunch|dinner|breakfast|มื้อ|배고|腹/i;

const GREETING_RE = /^(สวัสดี|หวัดดี|ดีจ้า|ดีครับ|ดีค่ะ|ดีนะ|hello|hi|hey)\b/i;

function pickRandom3(items) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(3, shuffled.length));
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

  // Welcome message เมื่อทักทาย
  if (GREETING_RE.test(trimmed)) {
    return {
      type: 'text',
      text: 'สวัสดีค่ะ! 🍜 ฉันช่วยแนะนำอาหารได้นะคะ กดเลือกได้เลย',
      quickReply: QUICK_REPLY
    };
  }

  // ลอง keyword ก่อน ถ้าจับได้ไม่ต้องเรียก Gemini เลย
  let result = keywordFallback(trimmed);

  // เรียก Gemini เฉพาะเมื่อข้อความมีคำที่เกี่ยวกับอาหารเท่านั้น
  if (!result && FOOD_KEYWORDS.test(trimmed)) {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      );
      result = await Promise.race([analyzeMessage(trimmed), timeout]);
    } catch (e) {
      console.log('Gemini unavailable:', e.message);
    }
  }

  if (result && result.intent === 'food') {
    const category = result.category || 'recommend';
    const menus = FALLBACK_MENUS[category] || FALLBACK_MENUS.recommend;
    return makeCarousel(pickRandom3(menus));
  }

  return {
    type: 'text',
    text: 'ขอโทษนะคะ ไม่เข้าใจเลย ลองพูดใหม่ได้เลยค่ะ 😊',
    quickReply: QUICK_REPLY
  };
}

module.exports = { buildReplyMessage };
