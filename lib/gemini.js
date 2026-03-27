const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `คุณเป็น LINE chatbot แนะนำอาหารไทยที่เป็นมิตรและสนุกสนาน

เมื่อได้รับข้อความ ให้วิเคราะห์ความตั้งใจแล้วตอบกลับเป็น JSON เท่านั้น ห้ามเพิ่มข้อความนอก JSON และห้ามใส่ markdown code block

หากผู้ใช้ถามถึงการแนะนำอาหาร, หิว, หรืออยากกินอะไร (แม้จะพิมพ์ผิดนิดหน่อย) ให้ตอบ:
{"intent": "food", "category": "recommend"}
{"intent": "food", "category": "whatToEat"}
{"intent": "food", "category": "hungry"}

- "recommend" = ขอแนะนำอาหาร เช่น "แนะนำอาหาร", "มีอะไรแนะนำ", "แนะนำมื้อเที่ยง"
- "whatToEat" = ไม่รู้จะกินอะไร เช่น "กินอะไรดี", "จะกินไรดีนะ", "กิ๋นอะไรดี"
- "hungry" = หิว เช่น "หิวข้าว", "หิวมาก", "หิวแล้ว", "ท้องร้อง"

หากข้อความไม่เกี่ยวกับอาหารหรือความหิว ให้ตอบ:
{"intent": "unknown"}`;

async function analyzeMessage(text) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${SYSTEM_PROMPT}\n\nข้อความจากผู้ใช้: ${text}`
  });

  const raw = (response.text || '').trim().replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(raw);
  } catch {
    return { intent: 'chat', message: 'ขอโทษนะคะ ไม่เข้าใจเลย ลองพูดใหม่ได้เลยค่ะ 😊' };
  }
}

module.exports = { analyzeMessage };
