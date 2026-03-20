const { buildReplyMessage } = require('./lib/reply');
const { createLineClient } = require('./lib/lineClient');
require('dotenv').config();

const path = require('path');
const express = require('express');
const line = require('@line/bot-sdk');

const {
  LINE_CHANNEL_SECRET,
  LINE_CHANNEL_ACCESS_TOKEN,
  PORT,
  BASE_URL
} = process.env;

if (!LINE_CHANNEL_SECRET || !LINE_CHANNEL_ACCESS_TOKEN) {
  console.error('Missing LINE_CHANNEL_SECRET or LINE_CHANNEL_ACCESS_TOKEN');
  process.exit(1);
}

const config = {
  channelSecret: LINE_CHANNEL_SECRET,
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN
};

const app = express();
const client = createLineClient(config);

// Serve local images for Flex messages
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// LINE webhook endpoint
app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events || [];
    const results = await Promise.all(events.map((event) => handleEvent(event, client)));
    res.json(results);
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).end();
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

async function handleEvent(event, lineClient) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  const text = (event.message.text || '').trim();

  try {
    const message = await buildReplyMessage(text);
    if (!message) {
      return null;
    }

    return lineClient.replyMessage(event.replyToken, message);
  } catch (err) {
    console.error('Handle event error:', err);
    return lineClient.replyMessage(event.replyToken, { type: 'text', text: 'ฉันไม่เข้าใจ' });
  }
}

const listenPort = PORT || 3000;
app.listen(listenPort, () => {
  const baseUrl = BASE_URL ? ` Base URL: ${BASE_URL}` : '';
  console.log(`Server running on port ${listenPort}.${baseUrl}`);
});
