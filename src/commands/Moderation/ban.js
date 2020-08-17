const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'ban',
      permissionLevel: 4,
      requiredPermissions: ['BAN_MEMBERS'],
      runIn: ['text'],
      description: `Permanently/Temporarily bans a member.`,
      usage: '<member:member> [days:int{1,7}] [reason:string] [...]',
      usageDelim: ' '
    });
  }

  async run(msg, [member, days = 0, ...reason]) {
    reason = reason.length > 0 ? reason.join(' ') : null;
    if (member.roles.highest.position >= msg.member.roles.highest.position) {
      return msg.sendMessage(`${this.client.config.emojis.error} You can't ban someone above you.`);
    } else if (member.bannable === false) {
      return msg.sendMessage(`${this.client.config.emojis.error} I cannot ban that user.`);
    }
    // await msg.guild.members.ban(member, { reason, days });
    msg.sendMessage(new MessageEmbed().setColor(this.client.config.colors.default).setDescription(`${this.client.config.emojis.success} Banned ${member.user}`))
    return new this.client.modlog(msg.guild)
      .setType('ban')
      .setModerator(msg.member)
      .setUser(member)
      .setReason({ current: reason })
      .send();
  }
};