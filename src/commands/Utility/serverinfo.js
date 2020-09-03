const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const humanLevels = {
   0: 'None',
   1: 'Low',
   2: 'Medium',
   3: 'High',
   4: 'Highest'
};

const regions = {
   'eu-west': 'Europe West',
   'europe': 'Europe',
   'brazil': 'Brazil',
   'hongkong': 'Hong Kong',
   'india': 'India',
   'japan': 'Japan',
   'russia': 'Russia',
   'singapore': 'Signapore',
   'southafrica': 'South Africa',
   'sydney': 'Sydney',
   'us-central': 'US Central',
   'us-east': 'US East',
   'us-south': 'US South',
   'us-west': 'US West'
};

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
         .addField('🔒 __**Channels**__', [
            `• ${msg.guild.channels.filter((ch) => ch.type === 'text').size} Text, ${
               msg.guild.channels.filter((ch) => ch.type === 'voice').size
            } Voice`,
            `• AFK: ${msg.guild.afkChannelID ? `<#${msg.guild.afkChannelID}> after ${msg.guild.afkTimeout / 60}min` : 'None.'}`
         ])
         .addField('🚶 __**Member Info**__', [`• Members: ${msg.guild.memberCount}`, `• Owner: ${msg.guild.owner.user.tag}`])
         .addField('❓ __**Other**__', [
            `• Roles: ${msg.guild.roles.size}`,
            `• Region: ${regions[msg.guild.region]}`,
            `• Created at: ${msg.guild.createdAt.toUTCString()}`,
            `• Verification Level: ${humanLevels[msg.guild.verificationLevel]}`
         ])
         .setThumbnail(msg.guild.getAvatar());
      return msg.sendMessage(embed);
   }
};
