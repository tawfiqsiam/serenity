const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
         description: 'Displays information about a role.',
         usage: '<role:role>'
      });
   }

   async run(msg, [role]) {
      return msg.sendEmbed(
         new MessageEmbed()
            .setColor(role.hexColor)
            .addField('• Name', role.name, true)
            .addField('• ID', role.id, true)
            .addField('• Color', role.hexColor, true)
            .addField('• Members', role.members.size, true)
            .addField('• Hoisted', role.hoist ? 'Yes' : 'No', true)
            .addField('• Mentionable', role.mentionable ? 'Yes' : 'No', true)
            .addField(
               `• Permission(s)`,
               role.permissions.toArray().length
                  ? role.permissions
                       .toArray()
                       .map((p) => this.formatPermission(p))
                       .join(', ')
                  : 'None'
            )
      );
   }

   formatPermission(permission) {
      return this.client.util.permissions[permission];
   }
};
