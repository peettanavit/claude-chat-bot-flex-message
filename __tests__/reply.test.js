const { buildReplyMessage } = require('../lib/reply');
const { FALLBACK_MENUS } = require('../lib/menus');

describe('buildReplyMessage', () => {
  test('returns flex message for แนะนำอาหาร', async () => {
    const message = await buildReplyMessage('แนะนำอาหาร');
    expect(message.type).toBe('flex');
    expect(message.contents).toBeTruthy();
  });

  test('returns flex message for กินอะไรดี', async () => {
    const message = await buildReplyMessage('กินอะไรดี');
    expect(message.type).toBe('flex');
    expect(message.contents).toBeTruthy();
  });

  test('returns flex message for หิวข้าว', async () => {
    const message = await buildReplyMessage('หิวข้าว');
    expect(message.type).toBe('flex');
    expect(message.contents).toBeTruthy();
  });

  test('returns fallback text for unknown keyword', async () => {
    const message = await buildReplyMessage('อยากไปเที่ยว');
    expect(message).toEqual({ type: 'text', text: 'ฉันไม่เข้าใจ' });
  });

  test('uses fallback menu list', async () => {
    const message = await buildReplyMessage('แนะนำอาหาร');
    const names = FALLBACK_MENUS.recommend.map((m) => m.name);
    expect(names).toContain(message.contents.body.contents[0].text);
  });
});

