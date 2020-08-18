const { Finalizer } = require('klasa')

module.exports = class extends Finalizer {
   constructor(...args) {
      super(...args, {
         enabled: true,
      })
   }

   async run(msg, command, response, runTime) {
      let data = {
         guild: msg.guild ? msg.guild.id : msg.channel.id,
         command: command.name,
         ran: Date.now(),
      }
      msg.author.settings.update('commandLog', data)
   }
}
