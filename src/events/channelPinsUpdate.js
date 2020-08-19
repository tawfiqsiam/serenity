const { Event, util } = require('klasa')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Event {
   async run(channel, time) {
      if (channel.type !== 'text') return
      let lc = channel.guild.settings.get('channels.logs')
      if (!lc) return
      let webhooks = await channel.guild.fetchWebhooks()
      let logsChannel = webhooks.get(lc)
      if (!logsChannel) return

      if (!channel.guild.settings.get('toggles.logs.channels')) return
      if (
         !channel.guild.me.permissions.has('ADMINISTRATOR') ||
         !channel.guild.me.permissions.has('VIEW_AUDIT_LOG') ||
         !channel.guild.me.permissions.has('MANAGE_WEBHOOKS')
      )
         return
      const embed = new MessageEmbed()
         .addField('Channel', `${channel.name} (${channel})`)
         .setColor('#FFFF00')
         .setTitle(`Pins Updated`)
         .setThumbnail('https://i.imgur.com/OGJoll2.png')
         .setFooter('Executor: Unknown User')
         .setTimestamp()
      if (channel.type !== 'category') {
         embed.addField('Parent Category', channel.parent.name)
      }
      let log
      await channel.guild
         .fetchAuditLogs({ limit: 1 })
         .then((logs) => {
            if (!logs) return
            log = logs.entries.first()
            if (!log) return
         })
         .catch(() => {})
      let user = log.executor
      let member = channel.guild.members.get(user.id)
      if (new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
         embed.setFooter(`Executor: ${user.tag} ${member && member.nick ? `(${member.nick})` : ''}`)
         embed.setThumbnail(await user.getAvatar())
         await logsChannel.send(embed)
      } else {
         await logsChannel.send(embed)
      }
   }
}
