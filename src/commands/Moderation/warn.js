const { Command } = require('klasa')

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'warn',
         permissionLevel: 6,
         runIn: ['text'],
         description: `Warns a user.`,
         usage: '<member:member> <reason:string> [...]',
         usageDelim: ' ',
      })
   }

   async run(msg, [member, ...reason]) {
      reason = reason.length > 0 ? reason.join(' ') : null

      if (member.roles.highest.position >= msg.member.roles.highest.position) {
         return msg.send(`${this.client.config.error} You can't warn someone above you.`)
      }

      if (msg.guild.settings.get('channels.modlog')) {
         new this.client.modlog(msg.guild).setType('warn').setModerator(msg.member).setUser(member).setReason(reason).send()
      }

      return msg.sendMessage(`${this.client.config.emojis.success} Warned ${member.user.tag} for ${reason}.`)
   }
}
