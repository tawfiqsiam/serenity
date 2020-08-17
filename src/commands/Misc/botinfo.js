const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      enabled: true,
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Displays bot info.',
    })
  }

  async run(msg) {
    let embed = new MessageEmbed()
      .setColor(this.client.config.colors.default)
      .setThumbnail(this.client.user.getAvatar())
      .addField('🤖 General', [
        `• Created On: ${new Date(this.client.user.createdTimestamp).toUTCString()}`,
        `• Default Prefix: ${this.client.options.prefix}`,
        `• Website: [argon.vip](http://argon.vip)`
      ])
      .addField('📄 Support', [
        `• Bot Owner: ${Array.from(this.client.owners).map(owner => owner.tag).join(', ')}`,
        `• Support: [Discord Server](https://discord.gg/zVBQNSm)`
      ])
      .setFooter(msg.author.username, msg.author.getAvatar())
      .setTimestamp();
    return msg.sendMessage(embed)
  }
}