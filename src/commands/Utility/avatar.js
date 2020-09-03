const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['av'],
         requiredPermissions: ['EMBED_LINKS'],
         description: 'Displays the users avatar.',
         usage: '[user:user]'
      });
   }

   async run(msg, [user = msg.author]) {
      return msg.sendMessage(
         new MessageEmbed().setImage(user.getAvatar()).setTitle(`${user.tag}'s avatar`).setColor(this.client.config.colors.default)
      );
   }
};
