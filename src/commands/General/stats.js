const { Command, Duration, version: klasaVersion } = require('klasa');
const { MessageEmbed, version: discordVersion } = require('discord.js');

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
            .addField('Guild Count', this.client.guilds.size, true)
            .addField('Channel Count', this.client.channels.size, true)
            .addField('Cached User Count', this.client.users.size, true)
            .addField(
               'Member Count',
               this.client.guilds.map((g) => g.memberCount).reduce((a, b) => a + b),
               true
            )
            .addField('Memory Used', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField('Uptime', Duration.toNow(Date.now() - process.uptime() * 1000), true)
            .addField('Node.js', process.version, true)
            .addField('Discord.js', discordVersion, true)
            .addField('Klasa', klasaVersion, true)
            .setColor(this.client.config.colors.default)
      );
   }
};
