const kpio = require('keepass.io/lib');
const databasePath = './pass.kdbx';
let {KEEPASS_PASS} = require('./constants.js');

class KeePassBot {
  constructor() {
    this.db = new kpio.Database();

    this.db.addCredential(new kpio.Credentials.Password(KEEPASS_PASS));
  }

  formatGroups(groups) {
    let self = this;
    let res = [];
    if (groups.length > 0) {
      groups.map((group) => {
        res.push({
          name: group.Name,
          uuid: group.UUID
        });
        let subRes = [];
        if (group.Groups && group.Groups.length) {
          subRes = self.formatGroups(group.Groups);
        }
        res = res.concat(subRes);
      })
    }
    return res;
  }

  searchEntries(searchString) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.db.loadFile(databasePath, function (err) {
        if (err) reject(err);

        let basicDatabase = self.db.getBasicApi();
        let groupInfo = basicDatabase.getGroupTree();
        let findedEntries = {};
        let groups = self.formatGroups(groupInfo);

        if (groups.length > 0) {
          groups.map((group) => {

            let entries = basicDatabase.getEntries(group.uuid)

            entries.map((entri) => {
              // check Title, Notes, User Name.
              if (entri.String.length) {
                entri.String.map((str) => {
                  switch (str.Key) {
                    case 'Title':
                    case 'Notes':
                    case 'UserName':
                      if (str.Value.toLowerCase().indexOf(searchString.toLowerCase()) + 1) {
                        findedEntries[entri.UUID] = entri.String;
                      }
                      break;
                  }
                })
              }
            });

          });
        }
        resolve(findedEntries);
      });
    });
  }

  showEntry(entry) {
    let title, userName, pass, notes;

    entry.map((item) => {
      switch (item.Key) {
        case "Title":
          title = `*** ${item.Value} ***\r\n`;
          break;
        case "UserName":
          userName = `${item.Value}\r\n`;
          break;
        case "Password":
          pass = `${item.Value._}\r\n`;
          break;
      }
    });

    return {
      'title': title + userName,
      pass
    };
  }
}

module.exports = KeePassBot;
