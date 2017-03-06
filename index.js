let TelegramBot = require('node-telegram-bot-api');
let find = require('./flow/find.js');
let dropboxUtil = require('./dropboxUtil.js');
let {RESOURCES, TOKEN} = require('./constants.js');


// Create a bot that uses 'polling' to fetch new updates
let bot = new TelegramBot(TOKEN, {
  polling: true
});

let flow = {
  state: null
};


bot.on('text', function (msg) {
  let messageChatId = msg.chat.id;
  let messageText = msg.text;

  // set comand steps
  let match = messageText.match(/^\/([a-zа-я]+)\s*/i);
  let command = Array.isArray(match) ? match[1] : null;

  if (command == 'find' || flow.state == 'find') {
    flow.state = command == 'find' ? 'find' : flow.state;
    find(bot, msg, flow);
  } else if (command == 'start' || flow.state == 'start') {
    let chatId = msg.chat.id;
    let resp = `
  *Это бот для работы с личной базой.*

  *Команды:*
  */find* - Найти в базе.
  */find .....* - сразу производит поиск в базе.
  `;
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp, {
      'parse_mode': 'Markdown'
    });
  } else {
    if (messageText == 'cool') {
      bot.sendMessage(messageChatId, RESOURCES.messages.cool);
    } else {
      bot.sendMessage(messageChatId, RESOURCES.messages.notFoundFlow);
    }
  }
});

dropboxUtil();
setInterval(() => {
  dropboxUtil();
}, 60000 * 60);

