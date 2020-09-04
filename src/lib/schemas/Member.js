const { Client } = require('@serenity/core');
const MGateway = require('@serenity/mg');

Client.use(MGateway);

module.exports = Client.defaultMemberSchema.add('exp', 'integer', { default: 0 });
