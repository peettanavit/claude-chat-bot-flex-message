function resolveImageUrl(rawUrl) {
  if (!rawUrl) {
    return rawUrl;
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }

  if (rawUrl.startsWith('/')) {
    const baseUrl = (process.env.BASE_URL || '').replace(/\/+$/, '');
    return baseUrl ? `${baseUrl}${rawUrl}` : rawUrl;
  }

  return rawUrl;
}

function makeFlexMessage(menu) {
  return {
    type: 'flex',
    altText: `เมนูแนะนำ: ${menu.name}`,
    contents: {
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
        contents: [
          {
            type: 'text',
            text: menu.name,
            weight: 'bold',
            size: 'xl',
            wrap: true
          },
          {
            type: 'separator',
            margin: 'md'
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
                  {
                    type: 'text',
                    text: 'แคลอรี',
                    size: 'sm',
                    color: '#666666',
                    flex: 2
                  },
                  {
                    type: 'text',
                    text: `${menu.calories} kcal`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                    flex: 1
                  }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'โปรตีน',
                    size: 'sm',
                    color: '#666666',
                    flex: 2
                  },
                  {
                    type: 'text',
                    text: `${menu.protein} g`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                    flex: 1
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  };
}

module.exports = {
  makeFlexMessage
};
