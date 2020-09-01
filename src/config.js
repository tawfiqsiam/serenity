require('dotenv').config();

exports.owners = ['426147523305144322'];
exports.invite = 'https://discord.gg/7JceW7S';
exports.db = process.env.db;
exports.prefix = '$';

exports.tokens = {
   bot: process.env.botToken
};

exports.emojis = {
   success: '<:success:713079769155240006>',
   error: '<:error:713079768723226674>',
   loading: '<a:loading:713079771495530596>',
   folder: '<:folder:750489648450764882>'
};

exports.colors = {
   default: '#A3C4FC',
   success: '#2ECC71',
   error: '#FF5042'
};

exports.options = {
   restTimeOffset: 0,
   prefix: this.prefix,
   owners: this.owners,
   commandEditing: true,
   createPiecesFolders: false,
   partials: ['MESSAGE', 'REACTION'],
   providers: {
      default: 'mongodb'
   },
   regexPrefix: /^((hey|hi|sup|yo) +)?(serenity)[,! ]/i,
   disabledCorePieces: ['commands', 'providers', 'languages'],
   disabledEvents: ['TYPING_START', 'PRESENCE_UPDATE', 'TYPING_STOP'],
   pieceDefaults: {
      commands: {
         runIn: ['text'],
         deletable: false,
         quotedStringSupport: true
      }
   },
   activity: {
      presence: {
         name: `$help`,
         type: 'WATCHING'
      }
   }
};
