const { Command } = require('@serenity/core');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Set a members rank.',
         permissionLevel: 10,
         hidden: true,
         usage: '<global|guild:default> (user:member) <level:integer>',
         subcommands: true
      });
      this.createCustomResolver('member', async (args, possible, msg, [action]) => {
         if (action === 'guild') return this.client.arguments.get('member').run(args, possible, msg);
         return this.client.arguments.get('user').run(args, possible, msg);
      });
   }

   async guild(msg, [member = msg.member, level]) {
      const exp = await msg.client.levels.getExpFromLevel(level);
      setTimeout(async () => {
         await msg.client.levels
            .setGuildMemberExp(member, exp, true)
            .then(() => {
               return msg.sendMessage(`${this.client.config.emojis.success} Rank updated for ${member.user.tag}.`);
            })
            .catch(() => {
               return msg.sendMessage(`${this.client.config.emojis.error} Couldn't update rank for ${member.user.tag}`);
            });
      }, 200);
   }

   async global(msg, [user = msg.author, level]) {
      const exp = await msg.client.levels.getExpFromLevel(level);
      setTimeout(async () => {
         await msg.client.levels
            .setGlobalExp(user, exp)
            .then(() => {
               return msg.sendMessage(`${this.client.config.emojis.success} Global rank updated for ${user.tag}.`);
            })
            .catch(() => {
               return msg.sendMessage(`${this.client.config.emojis.error} Couldn't update global rank for ${user.tag}`);
            });
      }, 200);
   }
};
