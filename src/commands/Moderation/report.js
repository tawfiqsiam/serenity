const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      permissionLevel: 6,
      requiredPermissions: ['MANAGE_ROLES'],
      runIn: ['text'],
      description: 'Report the mentioned member.',
      usage: '<member:member> <reason:string> [...]',
      usageDelim: " "
    });
  }

  async run(msg, [member, ...reason]) {
    reason = reason.join(' ');
    const channel = msg.guild.settings.get("channels.report");
    const reportChannel = msg.guild.channels.get(channel);
    if (!channel || !reportChannel) {
      let embed = new MessageEmbed()
        .setTitle(`${this.client.config.error} A reports channel hasn't been set yet.`)
        .setColor(this.client.config.errorColor)
      return msg.sendMessage(embed);
    } else {
      let embed = new MessageEmbed()
        .setTitle("New Report")
        .addField(`Reported User`, `${member} | ID: ${member.id}`)
        .addField(`Reported By`, `${msg.author} | ID: ${msg.author.id}`)
        .addField(`Report Reason`, `${reason}\n\n[Jump To Message](${msg.url})`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }).replace('.webp', '.png'))
        .setColor(this.client.config.defaultColor)
      await reportChannel.sendMessage(embed).then(async () => {
        await msg.client.reports.submitReport(msg.guild, msg.author, member, reason)
        await msg.sendMessage(`${this.client.config.success} Report sent.`);
      }).catch(err => {
        console.log(err)
        msg.sendMessage(`${this.client.config.error} I don\'t have permissions to send reports to the set channel, please contact a staff member.`)
      })
    }
  }
};