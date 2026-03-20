const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `คุณเป็น LINE chatbot แนะนำอาหารไทยที่เป็นมิตรและสนุกสนาน

เมื่อได้รับข้อความ ให้วิเคราะห์ความตั้งใจแล้วตอบกลับเป็น JSON เท่านั้น ห้ามเพิ่มข้อความนอก JSON

หากผู้ใช้ถามถึงการแนะนำอาหาร, หิว, หรืออยากกินอะไร (แม้จะพิมพ์ผิดนิดหน่อย) ให้ตอบ:
{"intent": "food", "category": "recommend"|"whatToEat"|"hungry"}

- "recommend" = ขอแนะนำอาหาร เช่น "แนะนำอาหาร", "มีอะไรแนะนำ", "แนะนำมื้อเที่ยง"
- "whatToEat" = ไม่รู้จะกินอะไร เช่น "กินอะไรดี", "จะกินไรดีนะ", "กิ๋นอะไรดี", "ไม่รู้จะกินไร"
- "hungry" = หิว เช่น "หิวข้าว", "หิวมาก", "หิวแล้ว", "ท้องร้อง", "배고파"

หากเป็นการสนทนาทั่วไปหรือคำถามอื่น ให้ตอบ:
{"intent": "chat", "message": "ข้อความตอบกลับภาษาไทยที่เป็นมิตร กระชับ ไม่เกิน 2 ประโยค"}`;

async function analyzeMessage(text) {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: text }]
  });

  const raw = response.content[0].text.trim();
  try {
    return JSON.parse(raw);
  } catch {
    return { intent: 'chat', message: 'ขอโทษนะคะ ไม่เข้าใจเลย ลองพูดใหม่ได้เลยค่ะ 😊' };
  }
}

module.exports = { analyzeMessage };
