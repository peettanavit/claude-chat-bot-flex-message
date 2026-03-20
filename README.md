# Line Food Recommendation Bot

## Quick Start (Local)

```bash
npm install
cp .env.example .env
npm start
```

Set `LINE_CHANNEL_SECRET` and `LINE_CHANNEL_ACCESS_TOKEN` in `.env`.


## Webhook URL

After deploy, set the LINE webhook URL to:

```
https://YOUR_DOMAIN/webhook
```

## LINE Setup (Short)

1) Create or use an existing LINE Official Account.
2) Enable Messaging API for that account and create a Messaging API channel.
3) In LINE Developers Console:
   - Basic settings: copy `Channel secret`
   - Messaging API tab: issue `Channel access token`
4) Set webhook URL and enable webhook.

## Google Cloud Run Deploy (Simple)

```bash
gcloud auth login

gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/line-food-bot

gcloud run deploy line-food-bot \
  --image gcr.io/YOUR_PROJECT_ID/line-food-bot \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars LINE_CHANNEL_SECRET=YOUR_SECRET,LINE_CHANNEL_ACCESS_TOKEN=YOUR_TOKEN
```

## Notes

- Supported keywords:
  - แนะนำร้านอาหาร
  - กินอะไรดี
  - หิวข้าว
- All other inputs return: `ฉันไม่เข้าใจ`
