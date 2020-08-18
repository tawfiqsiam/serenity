require('dotenv').config()

exports.owners = ['426147523305144322']
exports.invite = 'https://discord.gg/FuhyGgW'
exports.db = process.env.db
exports.prefix = '*'

exports.tokens = {
   bot: process.env.botToken,
}

exports.emojis = {
   success: '<:success:713079769155240006>',
   error: '<:error:713079768723226674>',
   loading: '<a:loading:713079771495530596>',
   rankUp: '<:up:695688887779196990>',
}

exports.colors = {
   default: '#a6c4fa',
   success: '#2ECC71',
   error: '#FF5042',
}

exports.options = {
   prefix: this.prefix,
   commandEditing: true,
   createPiecesFolders: false,
   owners: this.owners,
   disabledEvents: ['TYPING_START', 'PRESENCE_UPDATE', 'TYPING_STOP'],
   disabledCorePieces: ['commands', 'providers', 'languages'],
   providers: { default: 'mongodb' },
   presence: {
      activity: {
         name: `*help`,
         type: 'WATCHING',
      },
   },
   pieceDefaults: {
      commands: {
         runIn: ['text'],
         deletable: false,
         quotedStringSupport: true,
         cooldown: 3,
         usageDelim: ' ',
      },
   },
}
