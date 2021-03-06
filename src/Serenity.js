const SerenityClient = require('./lib/Client');
const { tokens, options } = require('./config');
const { Client } = require('@serenity/statcord');

const client = new SerenityClient(options);

client.statcord = new Client({
   client: client,
   key: tokens.statcord
});

client.statcord.on('autopost-start', () => {
   client.console.log('Loaded statcord.');
});



client.login(tokens.bot);
