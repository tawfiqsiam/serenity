const SerenityClient = require('./lib/Client');
const { tokens, options } = require('./config');
const { Client } = require('statcord.js');

const client = new SerenityClient(options);

client.statcord = new Client({
   client,
   key: process.env.statcordKey,
   postCpuStatistics: false,
   postMemStatistics: false,
   postNetworkStatistics: false
});

client.statcord.on('autopost-start', () => {
   client.console.log('Loaded statcord.');
});

client.statcord.on('post', (status) => {
   if (status) client.console.error(status);
});

client.login(tokens.bot);
