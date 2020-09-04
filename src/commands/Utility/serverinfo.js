const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         requiredPermissions: ['EMBED_LINKS'],
         description: 'Displays server info.'
      });
   }

   async run(msg) {
      let embed = new MessageEmbed()
         .setColor(this.client.config.colors.default)
         .addField(`🔒 __**${msg.language.get('CHANNELS')}**__`, [
            `• ${msg.guild.channels.cache.filter((ch) => ch.type === 'text').size} ${msg.language.get('TEXT')}, ${
               msg.guild.channels.cache.filter((ch) => ch.type === 'voice').size
            } ${msg.language.get('VOICE')}`,
            `• ${msg.language.get('AFK')}: ${
               msg.guild.afkChannelID
                  ? `<#${msg.guild.afkChannelID}> ${msg.language.get('after')} ${msg.guild.afkTimeout / 60}${msg.language.get('min')}`
                  : msg.language.get('NONE')
            }`
         ])
         .addField('🚶 __**Member Info**__', [`• Members: ${msg.guild.memberCount}`, `• Owner: ${msg.guild.owner.user.tag}`])
         .addField('❓ __**Other**__', [
            `• Roles: ${msg.guild.roles.cache.size}`,
            `• Region: ${msg.language.get(msg.guild.region.replace('-', '_'))}`,
            `• Created at: ${msg.guild.createdAt.toUTCString()}`,
            `• Verification Level: ${msg.language.get(msg.guild.verificationLevel)}`
         ])
         .setThumbnail(msg.guild.getAvatar());
      return msg.sendMessage(embed);
   }
};
