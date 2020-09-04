const { Client } = require('@serenity/core');

module.exports = Client.defaultUserSchema
   .add('exp', 'integer', { default: 0 })
   .add('tag', 'string')
   .add('rankcard', 'string', { default: '#a6c4fa' });
