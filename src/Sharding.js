const { ShardingManager } = require('discord.js');
const { tokens } = require('./config');
const chalk = require('chalk')

const manager = new ShardingManager('src/Serenity.js', {
  token: tokens.bot
});

manager.on('shardCreate', shard => {
  console.log(chalk.bgBlueBright(`[Client Manager]`), `Shard ${shard.id} launched.`)
});

manager.spawn().then((shards) => {
  shards.first().eval('this.webapi.launch()')
}).catch(console.error);
