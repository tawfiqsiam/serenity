const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         requiredPermissions: ['EMBED_LINKS'],
         description: 'Displays user info.',
         usage: '[user:user]'
      });
   }

   async run(msg, [user = msg.author]) {
      let member = msg.guild.members.cache.get(user.id);
      let createdTime = new Date(user.createdAt).toUTCString();
      let embed = new MessageEmbed()
         .addField('🚶 **User Info**', [
            `• Username: ${user.username}#${user.discriminator}`,
            `• Created At: ${createdTime}`,
            `• ID: ${user.id}`,
            `• Account Type: ${user.bot ? 'Bot' : 'User'}`
         ])
         .setThumbnail(user.getAvatar())
         .setColor(this.client.config.colors.default);
      if (member) {
         embed.addField('🛡️ **Server Info**', [
            `• Nickname: ${member.nickname ? member.nickname : 'No nickname.'}`,
            `• Roles: ${member.roles.cache
               .filter((r) => r.name !== '@everyone')
               .map((role) => `\`${role.name}\``)
               .join(', ')}`,
            `• Joined at: ${new Date(member.joinedAt).toUTCString()}`,
            `• Last Message: ${user.lastMessage ? user.lastMessage : 'None logged.'}`
         ]);
      }
      return msg.sendMessage(embed);
   }
};
