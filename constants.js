const RESOURCES = {
  auth: {
    ids: [
      // users who have access
      // .....
      // .....
      // .....
      // .....
    ]
  },
  messages: {
    notFoundFlow: 'Нейзвестная команда!',
    notAllowed: 'Не можно!',
    cool: 'Awesome!!!'
  }

};

// replace the value below with the Telegram token you receive from @BotFather
const TOKEN = '#YOUR ACCESS TOKEN#';

// Access token for dropbox
const DROPBOX_ACCESS_TOKEN = '#YOUR ACCESS TOKEN#';
// link to base
const DROPBOX_SHARED_LINK = '#YOUR DROPBOX SHARED LINK#';
// pass to base
const KEEPASS_PASS = '#YOUR KEEPASS BASE PASS#';
const TIME_TO_SHOW = '30000';

module.exports = {
  RESOURCES,
  TOKEN,
  DROPBOX_ACCESS_TOKEN,
  DROPBOX_SHARED_LINK,
  KEEPASS_PASS,
  TIME_TO_SHOW
};
