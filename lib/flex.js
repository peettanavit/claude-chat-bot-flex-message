function resolveImageUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
  if (rawUrl.startsWith('/')) {
    const baseUrl = (process.env.BASE_URL || '').replace(/\/+$/, '');
    return baseUrl ? `${baseUrl}${rawUrl}` : rawUrl;
  }
  return rawUrl;
}

function getBadge(menu) {
  if (menu.calories < 350) return { label: 'แคลอรีต่ำ', color: '#27AE60' };
  if (menu.protein >= 30) return { label: 'โปรตีนสูง', color: '#2980B9' };
  if (menu.calories >= 700) return { label: 'อิ่มนาน', color: '#E67E22' };
  return { label: 'เมนูแนะนำ', color: '#8E44AD' };
}

function makeBubble(menu) {
  const badge = getBadge(menu);
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: resolveImageUrl(menu.image),
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover'
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      paddingAll: 'lg',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              backgroundColor: badge.color,
              cornerRadius: 'sm',
              paddingAll: 'xs',
              paddingStart: 'md',
              paddingEnd: 'md',
              contents: [
                {
                  type: 'text',
                  text: badge.label,
                  size: 'xs',
                  color: '#ffffff',
                  weight: 'bold'
                }
              ]
            },
            { type: 'filler' }
          ]
        },
        {
          type: 'text',
          text: menu.name,
          weight: 'bold',
          size: 'xl',
          wrap: true,
          margin: 'sm'
        },
        {
          type: 'separator',
          margin: 'md',
          color: '#EEEEEE'
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'md',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                { type: 'text', text: '🔥 แคลอรี', size: 'sm', color: '#888888', flex: 2 },
                { type: 'text', text: `${menu.calories} kcal`, size: 'sm', color: '#333333', align: 'end', flex: 1, weight: 'bold' }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                { type: 'text', text: '💪 โปรตีน', size: 'sm', color: '#888888', flex: 2 },
                { type: 'text', text: `${menu.protein} g`, size: 'sm', color: '#333333', align: 'end', flex: 1, weight: 'bold' }
              ]
            }
          ]
        }
      ]
    }
  };
}

const QUICK_REPLY = {
  items: [
    {
      type: 'action',
      action: { type: 'message', label: '🔄 แนะนำอีกครั้ง', text: 'แนะนำ' }
    },
    {
      type: 'action',
      action: { type: 'message', label: '🍽 กินอะไรดี', text: 'กินอะไรดี' }
    },
    {
      type: 'action',
      action: { type: 'message', label: '😋 หิวมาก', text: 'หิวมาก' }
    }
  ]
};

function makeCarousel(menus) {
  return {
    type: 'flex',
    altText: `เมนูแนะนำ: ${menus.map(m => m.name).join(', ')}`,
    contents: {
      type: 'carousel',
      contents: menus.map(makeBubble)
    },
    quickReply: QUICK_REPLY
  };
}

module.exports = { makeCarousel, QUICK_REPLY };
