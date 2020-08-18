const { Command } = require('klasa')

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         permissionLevel: 6,
         requiredPermissions: ['MANAGE_ROLES'],
         runIn: ['text'],
         description: 'Shows reports for the mentioned member.',
         usage: '<member:member> [page:integer]',
         usageDelim: ' ',
      })
   }

   async run(msg, [member, page = 1]) {
      const get = await msg.client.reports.getReports(member)
      const reports = get.reverse()
      const paginated = this.client.util.paginate(reports, page, 5)

      if (!reports.length) return msg.channel.send(`No reports for ${member.user.tag}`)

      let embed = new MessageEmbed()
         .addField(
            `Reports (${member.user.tag}) (Page ${paginated.page}/${paginated.maxPage})`,
            paginated.items.map(
               (report) =>
                  `**Reported By:** <@${report.userReporting}>\n**Reason:** ${report.reason}\n**Reported at:** ${new Date(
                     report.time
                  ).toUTCString()}`
            )
         )
         .setColor(this.client.config.defaultColor)
         .setFooter(
            `${msg.author.username}`,
            msg.author.displayAvatarURL({ dynamic: true, size: 2048 }).replace('.webp', '.png')
         )
         .setTimestamp(Date.now())
      await msg.sendMessage(embed)
   }
}
