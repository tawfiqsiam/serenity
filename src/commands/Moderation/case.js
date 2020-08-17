const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'case',
      permissionLevel: 3,
      runIn: ['text'],
      description: `Displays information about a case.`,
      usage: '<case:integer>'
    });
  }

  async run(msg, [selected]) {
    const log = msg.guild.settings.get('data.modlogs')[selected - 1];
    if (!log) return msg.send(`${this.client.config.emojis.error} I couldn't find that case.`);

    const embed = new MessageEmbed()
      .setColor(this.client.modlog.colour(log.type))
      .setTitle(this.client.modlog.action(log.type))
      .addField(`**Member**`, `${log.user.tag} (${log.user.id})`)
      .setThumbnail(log.user.avatar)
      .addField(`**Reason**`, log.reason.current)
      .setFooter(`Case ${log.case}`)
      .setAuthor(log.moderator.tag, log.moderator.avatar)
      .setTimestamp(log.date);

    if (log.type === 'mute' || log.type === 'unmute') {
      if (log.duration && log.duration !== null) {
        if (log.type === 'unmute') embed.addField('**Original Mute Duration**', log.duration);
        if (log.type === 'mute') embed.addField('**Mute Duration**', log.duration);
      }
    }
    if (log.type === 'unmute' && log.reason.original) embed.addField('**Original Mute Reason**', log.reason.original);

    return msg.sendMessage(embed);
  }
};