const { Command } = require('@serenity/core');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['setPrefix'],
         description: 'Change the command prefix the bot uses in your server.',
         permissionLevel: 6,
         runIn: ['text'],
         usage: '[default|prefix:string{1,10}]'
      });
   }

   async run(msg, [prefix]) {
      const get = msg.guild.settings.get('prefix');
      if (!prefix) {
         return msg.sendMessage(`Current Prefix: **${get}**`);
      }
      if (prefix === 'default') return await this.default(msg);
      if (get === prefix) throw msg.send(`${this.client.config.emojis.error} Prefix is already set to ${prefix}.`);
      await msg.guild.settings.update('prefix', prefix);
      return msg.send(`${this.client.config.emojis.success} The prefix for this guild has been set to "${prefix}"`);
   }

   async default(msg) {
      await msg.guild.settings.reset('prefix');
      return msg.sendMessage(`${this.client.config.emojis.success} The prefix for this guild has been reset to default.`);
   }
};
