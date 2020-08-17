const { Monitor } = require('klasa');

module.exports = class extends Monitor {
   constructor(...args) {
      super(...args, {
         ignoreOthers: false,
         ignoreSelf: true,
         ignoreBots: true,
         ignoreWebhooks: true,
         ignoreEdits: true,
         ignoreBlacklistedUsers: true,
         ignoreBlacklistedGuilds: true
      });
   }

   async run(msg) {
      await this.client.levels.giveGlobalExp(msg.author)
      if (!msg.guild) return;
      let check = await msg.guild.settings.get('ignores');
      if (await check.find((o) => o.channel === msg.channel.id && o.xp === false)) return;
      await this.client.levels.giveGuildUserExp(msg.member, msg)
   }
}
