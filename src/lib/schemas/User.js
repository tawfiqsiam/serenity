const { KlasaClient } = require('klasa')

module.exports = KlasaClient.defaultUserSchema
   .add('exp', 'integer', { default: 0 })
   .add('tag', 'string')
   .add('rankcard', 'string', { default: '#a6c4fa' })
