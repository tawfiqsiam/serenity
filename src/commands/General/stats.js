const { Command, Duration, version } = require('@serenity/core');
const { MessageEmbed, version: djsVersion } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['info'],
         description: "Provides information about Serenity's standing."
      });
   }

   async run(msg) {
      msg.sendMessage(
         new MessageEmbed()
            .addField('Server Count', this.client.guilds.cache.size, true)
            .addField('Channel Count', this.client.channels.cache.size, true)
            .addField('Cached User Count', this.client.users.cache.size, true)
            .addField(
               'Member Count',
               this.client.guilds.cache.map((g) => g.memberCount).reduce((a, b) => a + b),
               true
            )
            .addField('Memory Used', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField('Uptime', Duration.toNow(Date.now() - process.uptime() * 1000), true)
            .addField('Node.js', process.version.replace('v', ''), true)
            .addField('Discord.js', djsVersion, true)
            .addField('Serenity', version, true)
            .setColor(this.client.config.colors.default)
      );
   }
};
