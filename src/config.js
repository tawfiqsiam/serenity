require('dotenv').config();

exports.owners = ['426147523305144322'];
exports.invite = 'https://discord.gg/FuhyGgW';
exports.db = process.env.db;
exports.prefix = '*';

exports.tokens = {
   bot: process.env.botToken,
   statcord: process.env.statcordKey
};

exports.emojis = {
   success: '<:success:720905509758173247>',
   error: '<:error:720905509758173247>',
   loading: '<a:loading:720905509758173247>',
   rankUp: '<:up:720905509758173247>'
};

exports.colors = {
   default: '#a6c4fa',
   success: '#2ECC71',
   error: '#FF5042'
};

exports.options = {
   restTimeOffset: 0,
   prefix: this.prefix,
   createPiecesFolders: false,
   owners: this.owners,
   disabledCorePieces: ['languages'],
   allowedMentions: { parse: ['users'] },
   providers: { default: 'mongodb' },
   presence: {
      activity: {
         name: `*help`,
         type: 'WATCHING'
      }
   },
   schedule: {
      interval: 15000
   },
   pieceDefaults: {
      commands: {
         runIn: ['text'],
         deletable: false,
         quotedStringSupport: true,
         cooldown: 3,
         usageDelim: ' '
      }
   }
};
