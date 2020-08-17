const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'softban',
      permissionLevel: 6,
      requiredPermissions: ['BAN_MEMBERS'],
      runIn: ['text'],
      description: `Bans the user and immediately unbans them to get rid of messages.`,
      usage: '<user:user> [days:int{1,7}] [reason:string] [...]',
      usageDelim: ' '
    });
  }

  async run(msg, [user, days = 1, ...reason]) {
    reason = reason.length > 0 ? reason.join(' ') : null;
    const member = await msg.guild.members.fetch(user).catch(() => null);
    if (!member);
    else if (member.roles.highest.position >= msg.member.roles.highest.position) {
      return msg.send(`${this.client.config.error} You can't ban someone above you.`);
    } else if (member.bannable === false) {
      return msg.send(`${this.client.config.error} I cannot ban that user.`);
    }

    await msg.guild.members.ban(user, { reason, days });
    await msg.guild.members.unban(user);

    if (msg.guild.settings.get('channels.modlog')) {
      new this.client.modlog(msg.guild)
        .setType('softban')
        .setModerator(msg.author)
        .setUser(user)
        .setReason(reason)
        .send();
    }

    return msg.sendMessage(`${this.client.config.success} Soft-banned ${member.user.tag}.`);
  }

};