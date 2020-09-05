const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
         description: (language) => language.get('COMMAND_ROLEINFO_DESCRIPTION'),
         usage: '<role:role>'
      });
   }

   async run(msg, [role]) {
      return msg.sendEmbed(
         new MessageEmbed()
            .setColor(role.hexColor)
            .addField(`• ${msg.language.get('NAME')}`, role.name, true)
            .addField(`• ${msg.language.get('ID')}`, role.id, true)
            .addField(`• ${msg.language.get('COLOR')}`, role.hexColor, true)
            .addField(`• ${msg.language.get('MEMBERS')}`, role.members.size, true)
            .addField(`• ${msg.language.get('HOISTED')}`, role.hoist ? msg.language.get('YES') : msg.language.get('NO'), true)
            .addField(`• ${msg.language.get('MENTIONABLE')}`, role.mentionable ? msg.language.get('YES') : msg.language.get('NO'), true)
            .addField(
               `• ${msg.language.get('PERMISSIONS')}`,
               role.permissions.toArray().length
                  ? role.permissions
                       .toArray()
                       .map((p) => msg.language.get(p))
                       .join(', ')
                  : msg.language.get('NONE')
            )
      );
   }
};
