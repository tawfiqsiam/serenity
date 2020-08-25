const { Event, util } = require('klasa')
const { MessageEmbed } = require('discord.js')
const CHANNEL_TYPE = {
   text: 'Text channel',
   voice: 'Voice channel',
   category: 'Category'
}

module.exports = class extends Event {
   async run(oldChannel, channel) {
      if (
         channel.type === 1 ||
         channel.type === 3 ||
         !channel.guild.me.permissions.has('VIEW_AUDIT_LOG') ||
         !channel.guild.me.permissions.has('MANAGE_WEBHOOKS') ||
         !channel.guild.me.permissions.has('ADMINISTRATOR')
      )
         return
      let lc = channel.guild.settings.get('channels.logs')
      if (!lc) return
      let webhooks = await channel.guild.fetchWebhooks()
      let logsChannel = webhooks.get(lc)
      if (!logsChannel) return
      if (!channel.guild.settings.get('toggles.logs.channels')) return
      const embed = new MessageEmbed()
         .addField('Channel', `${channel.name} (${channel})`)
         .setColor('#FFFF00')
         .setTitle(`${CHANNEL_TYPE[channel.type]} Updated`)
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

function getDifference(array1, array2) {
   return array1.filter((i) => {
      return array2.indexOf(i) < 0
   })
}

function diff(obj1, obj2) {
   const result = {}
   if (Object.is(obj1, obj2)) {
      return undefined
   }
   if (!obj2 || typeof obj2 !== 'object') {
      return obj2
   }
   Object.keys(obj1 || {})
      .concat(Object.keys(obj2 || {}))
      .forEach((key) => {
         if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
            result[key] = obj2[key]
         }
         if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
            const value = diff(obj1[key], obj2[key])
            if (value !== undefined) {
               result[key] = value
            }
         }
      })
   return result
}
