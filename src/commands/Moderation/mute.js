const { Command, Duration } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      permissionLevel: 6,
      requiredPermissions: ['MANAGE_ROLES'],
      runIn: ['text'],
      description: 'Mutes a mentioned member.',
      usage: '<member:member> [when:time] [reason:...string]',
      usageDelim: ' '
    });
  }

  async run(msg, [member, when, reason]) {
    if (member.id === msg.author.id) throw 'Why would you mute yourself?';
    if (member.id === this.client.user.id) throw 'Have I done something wrong?';

    if (member.roles.highest.position >= msg.member.roles.highest.position) {
      throw new MessageEmbed()
        .setColor(this.client.config.colors.error)
        .setDescription(`${this.client.config.emojis.error} You cannot mute this user.`)
    }
    if (msg.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) {
      throw new MessageEmbed()
        .setColor(this.client.config.colors.error)
        .setDescription(`${this.client.config.emojis.error} I cannot mute this user.`)
    }

    let result = await this.client.util.getMutedRole(msg.guild);

    if (member.roles.has(result.role.id)) throw `${this.client.config.emojis.error} This member is already muted.`;
    await member.roles.add(result.role);
    if (msg.guild.settings.get('toggles.nickmute')) {
      await member.setNickname(`[Muted] ${member.nickname ? member.nickname : member.user.username}`)
    }

    new this.client.modlog(msg.guild)
      .setType('mute')
      .setModerator(msg.member)
      .setUser(member)
      .setReason({ current: reason })
      .setDuration(when ? Duration.toNow(when) : `Permanent`)
      .send();


    const get = msg.guild.settings.get('data.modlogs').filter(m => m.user === member.id && m.type === "mute")
    const filtered = get[get.length - 1]

    if (when) {
      this.client.schedule.create('unmute', when, {
        data: {
          reason: reason,
          duration: when ? Duration.toNow(when) : `Permanent`,
          guild: msg.guild.id,
          user: member.id,
        }
      });
      return msg.sendMessage(`${this.client.config.emojis.success} ${member.user.tag} was temporarily muted for ${Duration.toNow(when)}${reason ? ` with reason: **${reason}**` : '.'}`);
    }

    return msg.sendMessage(`${this.client.config.emojis.success} ${member.user.tag} was muted${reason ? ` with reason: **${reason}**` : '.'}`);
  }

};