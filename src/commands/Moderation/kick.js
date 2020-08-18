const { Command } = require('klasa')

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'kick',
         permissionLevel: 3,
         requiredPermissions: ['KICK_MEMBERS'],
         runIn: ['text'],
         description: `Kicks a user.`,
         usage: '<member:member> [reason:string] [...]',
         usageDelim: ' ',
      })
   }

   async run(msg, [member, reason]) {
      reason = reason.length > 0 ? reason : null

      if (member.roles.highest.position >= msg.member.roles.highest.position) {
         return msg.sendMessage(`${this.client.config.emojis.error} You can't kick someone above you.`)
      } else if (member.kickable === false) {
         return msg.sendMessage(`${this.client.config.emojis.error} I cannot kick that user.`)
      }

      await member.kick(reason)
      new this.client.modlog(msg.guild)
         .setType('kick')
         .setModerator(msg.member)
         .setUser(member)
         .setReason({ current: reason })
         .send()

      return msg.sendMessage(`${this.client.config.success} Kicked ${member.user.tag}.`)
   }
}
