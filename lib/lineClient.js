const line = require('@line/bot-sdk');

function createLineClient(config) {
  return new line.Client(config);
}

module.exports = {
  createLineClient
};
