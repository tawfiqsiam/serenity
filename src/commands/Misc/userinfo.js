const { Command } = require('klasa')
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      enabled: true,
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Displays user info.',
      usage: "[user:user]"
    })
    this.statuses = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    };
  }

  async run(msg, [user = msg.author]) {
    let member = msg.guild.members.get(user.id) ? msg.guild.members.get(user.id) : undefined;
    let joinedTime = ""
    member ? joinedTime = new Date(member.joinedAt).toUTCString() : ""
    let createdTime = new Date(user.createdTimestamp).toUTCString();
    let embed = new MessageEmbed()
      .addField('🚶 __**User Info**__', [
        `• Username: ${user.username}#${user.discriminator}`,
        `• Created At: ${createdTime}`,
        `• ID: ${user.id}`,
        `• Account Type: ${user.bot ? 'Bot' : 'User'}`
      ])
      .setThumbnail(user.getAvatar())
      .setColor(this.client.config.colors.default)
      .setFooter(msg.author.username, msg.author.getAvatar())
      .setTimestamp()
    if (member) {
      embed.addField('🛡️ __**Guild-based Info**__', [
        `• Nickname: ${member.nickname ? member.nickname : 'No nickname.'}`,
        `• Roles: ${member.roles.filter(r => r.name !== "@everyone").map(role => `\`${role.name}\``).join(', ')}`,
        `• Joined at: ${joinedTime}`,
        `• Last Message: ${user.lastMessage ? user.lastMessage : "None logged."}`
      ])
    }
    return msg.sendMessage(embed);
  }
}
