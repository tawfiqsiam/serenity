const { Command } = require('@serenity/core');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: (language) => language.get('COMMAND_MULTIPLIER_DESCRIPTION'),
         usage: '[0.5|1.0|1.5|2.0]',
         permissionLevel: 6,
         requiredPermissions: ['EMBED_LINKS']
      });
   }

   async run(msg, [choice]) {
      let check = msg.guild.settings.get('levels.multiplier');
      if (!choice) return msg.send(`The multiplier is currently set to ${check}x.`);
      if (check == choice) throw msg.language.get('COMMAND_MULTIPLIER_EXISTS', choice);
      await msg.guild.settings.update('levels.multiplier', choice);
      return msg.sendLocale('COMMAND_MULTIPLIER_SUCCESS', [choice]);
   }
};
