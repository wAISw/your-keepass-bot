let Dropbox = require('dropbox');
let fs = require('fs');
let {DROPBOX_SHARED_LINK, DROPBOX_ACCESS_TOKEN} = require('./constants.js');

function dropboxUtil() {
  console.log(`start downloading`);
  let dbx = new Dropbox({'accessToken': DROPBOX_ACCESS_TOKEN});
  dbx.sharingGetSharedLinkFile({url: DROPBOX_SHARED_LINK})
    .then(function (data) {
      fs.writeFile(data.name, data.fileBinary, 'binary', function (err) {
        if (err) {
          throw err;
        }
        console.log(`The new version of the database is saved`);
      });
    })
    .catch(function (err) {
      console.error(err);
    });
}
module.exports = dropboxUtil;
