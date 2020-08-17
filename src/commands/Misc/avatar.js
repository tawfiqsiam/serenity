const { Command } = require('klasa')
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      enabled: true,
      aliases: ['av'],
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Displays the users avatar.',
      usage: '[user:user]',
    })
  }

  async run(msg, [user = msg.author]) {
    let embed = new MessageEmbed()
      .setImage(user.getAvatar())
      .setTitle(`${user.tag}'s avatar`)
      .setColor(this.client.config.colors.default);
    return msg.sendMessage(embed)
  }
}