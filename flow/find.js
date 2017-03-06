let KeePassBot = require('../KeePassBot');
let {
  RESOURCES,
  TIME_TO_SHOW
} = require('../constants.js');

// flow for command find

let questionSended = false;
let text = null;

function find(bot, msg, flow) {
  let messageChatId = msg.chat.id;
  let messageText = msg.text;
  let userId = msg.from.id;
  let allowedUserID = null;
  const AUTH = RESOURCES.auth;

  if (questionSended)
    text = messageText;

  let match = messageText.match(/\/find (.+)/i);
  if (match && match[1]) {
    text = match[1];
  }

  for (let id of AUTH.ids) {
    if (userId === id)
      allowedUserID = id;
  }

  if (!allowedUserID)
    bot.sendMessage(messageChatId, RESOURCES.messages.notAllowed);

// если проверочный код верен, то производим поиск
  if (allowedUserID) {

    if (!text) {
      bot.sendMessage(messageChatId, "Что искать?");
      questionSended = true;
    } else {
      let kp = new KeePassBot();
      kp.searchEntries(text).then((findedEntries) => {
        if (Object.keys(findedEntries).length > 0) {
          let findedEntriesArray = Object.values(findedEntries);
          let i = 0;
          let intervalID = setInterval(() => {
            if (findedEntriesArray.length <= i) {
              clearInterval(intervalID);
            } else {
              let rows = kp.showEntry(findedEntriesArray[i]);
              // send info
              bot.sendMessage(messageChatId, rows.title).then((messData) => {
                setTimeout(() => {
                  bot.editMessageText("message removed", {
                    message_id: messData.message_id,
                    chat_id: messData.chat.id,
                    text: messData.text
                  });
                }, TIME_TO_SHOW);
              });
              // send pass
              setTimeout(() => {
                bot.sendMessage(messageChatId, rows.pass).then((messData) => {
                  setTimeout(() => {
                    bot.editMessageText("message removed", {
                      message_id: messData.message_id,
                      chat_id: messData.chat.id,
                      text: messData.text
                    });
                  }, TIME_TO_SHOW);
                });
              }, 100);
              i++;
            }
          }, 300);
        } else {
          bot.sendMessage(messageChatId, "Ничего не найдено.");
        }
        questionSended = false;
        flow.state = null;
        text = null;
      }, (err) => {
        bot.sendMessage(messageChatId, "Что то пошло не так!");
      });
    }
  }

}
module.exports = find;
