const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['av'],
         requiredPermissions: ['EMBED_LINKS'],
         description: (language) => language.get('COMMAND_AVATAR_DESCRIPTION'),
         usage: '[user:user]'
      });
   }

   async run(msg, [user = msg.author]) {
      return msg.sendMessage(
         new MessageEmbed()
            .setImage(user.getAvatar())
            .setTitle(msg.language.get('COMMAND_AVATAR_PLURAL', user.tag))
            .setColor(this.client.config.colors.default)
      );
   }
};
