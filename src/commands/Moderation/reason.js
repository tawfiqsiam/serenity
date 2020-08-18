const { Command, util } = require('klasa')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'reason',
         permissionLevel: 10,
         runIn: ['text'],
         requiredSettings: ['channels.modlog'],
         description: 'Changes the reason for the provided case',
         usage: '<case:integer> <reason:...string>',
         hidden: true,
         usageDelim: ' ',
      })
   }

   async run(msg, [selected, ...reason]) {
      reason = reason.length > 0 ? reason.join(' ') : null

      const modlogs = msg.guild.settings.get('data.modlogs')
      const log = modlogs[selected - 1]

      if (!log) return msg.send(`${this.client.config.error} I didn't find a case matching that case number.`)

      const channel = msg.guild.channels.get(msg.guild.settings.get('channels.modlog'))
      if (!channel) {
         msg.sendMessage(
            `${this.client.config.error} The mod log channel is invalid, contact a server administrator and ask them to re-set it.`
         )
         return msg.guild.settings.reset(`channels.modlog`)
      }

      const messages = await channel.messages.fetch({ limit: 100 })
      const message = messages.find(
         (mes) =>
            mes.author.id === this.client.user.id &&
            mes.embeds.length > 0 &&
            mes.embeds[0].type === 'rich' &&
            mes.embeds[0].footer &&
            mes.embeds[0].footer.text === `Case ${selected}`
      )

      const message2 = messages.find(
         (mes) =>
            mes.author.id === this.client.user.id &&
            mes.embeds.length > 0 &&
            mes.embeds[0].type === 'rich' &&
            mes.embeds[0].footer &&
            mes.embeds[0].footer.text === `Case ${log.originalCase}`
      )

      if (message2) {
         const embed = message.embeds[0]
         const test = embed.fields[1]
         console.log(test)
         embed.description = [type, user, `**Reason**: ${reason}`].join('\n')
         await message.edit({ embed })
      } else {
         const embed = new MessageEmbed()
            .setTitle(this.client.modlog.action(log.type))
            .setColor(this.client.modlog.colour(log.type))
            .setDescription(`**Case Reposted, Reason: Case's Original Reason Edited**`)
            .addField(`**Member**`, `${log.user.tag} (${log.user.id})`)
            .setThumbnail(log.user.avatar)
            .addField(`**Reason**`, `${reason}`)
            .setFooter(`Case ${log.case}`)
            .setAuthor(log.moderator.tag, log.moderator.avatar)
            .setTimestamp(log.date)
         ;['mute', 'unmute'].includes(log.type) && log.duration !== null
            ? embed.addField(
                 log.type === 'unmute' ? `**Original Mute Duration**` : `**Duration**`,
                 `${log.duration[0].toUpperCase()}${log.duration.slice(1)}`
              )
            : ''
         log.type === 'unmute'
            ? embed.addField(`**Original Mute Reason**`, `${log.originalReason ? log.originalReason : `No reason provided`}`)
            : ''
         await channel.send({ embed })
      }

      const embed = new MessageEmbed()
         .setTitle(this.client.modlog.action(log.type))
         .setColor(this.client.modlog.colour(log.type))
         .setDescription(`**Case Reposted, Reason: Case's Reason Edited**`)
         .addField(`**Member**`, `${log.user.tag} (${log.user.id})`)
         .setThumbnail(log.user.avatar)
         .addField(`**Reason**`, `${reason}`)
         .setFooter(`Case ${log.case}`)
         .setAuthor(log.moderator.tag, log.moderator.avatar)
         .setTimestamp(log.date)
      ;['mute', 'unmute'].includes(log.type) && log.duration !== null
         ? embed.addField(
              log.type === 'unmute' ? `**Original Mute Duration**` : `**Duration**`,
              `${log.duration[0].toUpperCase()}${log.duration.slice(1)}`
           )
         : ''
      log.type === 'unmute'
         ? embed.addField(`**Original Mute Reason**`, `${log.originalReason ? log.originalReason : `No reason provided`}`)
         : ''
      await channel.send({ embed })

      modlogs[selected].reason = reason
      await msg.guild.settings.update('data.modlogs', modlogs)

      return msg.sendMessage(`${this.client.config.success} Updated reason for case ${selected}.`)
   }
}
