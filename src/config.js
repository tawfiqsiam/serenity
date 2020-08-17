require('dotenv').config()

exports.owners = ['426147523305144322']
exports.invite = 'https://discord.gg/7JceW7S'
exports.db = process.env.db
exports.prefix = '$'

exports.tokens = {
  bot: process.env.botToken
}

exports.emojis = {
  success: '<:success:695674669449216090>',
  error: '<:error:695675079899742259>',
  loading: '<a:loading:695675909943984219>'
}

exports.colors = {
  default: '#7B2BC0',
  success: '#2ECC71',
  error: '#FF5042'
}


exports.options = {
  prefix: this.prefix,
  commandEditing: true,
  createPiecesFolders: false,
  owners: this.owners,
  disabledEvents: ['TYPING_START', 'PRESENCE_UPDATE', 'TYPING_STOP'],
  disabledCorePieces: ['commands', 'providers', 'languages'],
  regexPrefix: /^((hey|hi|sup|yo) +)?(serenity)[,! ]/i,
  partials: ['MESSAGE', 'REACTION'],
  providers: { default: "mongodb" },
  presence: {
    activity: {
      name: `$help`,
      type: 'WATCHING'
    }
  },
  pieceDefaults: {
    commands: {
      runIn: ['text'],
      deletable: false,
      quotedStringSupport: true
    }
  }
}