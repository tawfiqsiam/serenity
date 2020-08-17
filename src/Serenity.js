const SerenityClient = require('./lib/Client');
const { tokens, options } = require('./config');

const client = new SerenityClient(options)

client.login(tokens.bot);