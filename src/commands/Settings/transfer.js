const { Command } = require('klasa')

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: (language) => language.get('COMMAND_TRANSFER_DESCRIPTION'),
         permissionLevel: 7,
         cooldown: 1800,
      })
   }

   async run(msg) {
      await msg.sendMessage(`${this.client.config.emojis.loading} ${msg.language.get('COMMAND_TRANSFER_TRANSFERRING')}`)
      await this.client.levels.transferLevels(msg.guild).then((res) => {
         if (res === true) {
            msg.sendMessage(`${this.client.config.emojis.success} ${msg.language.get('COMMAND_TRANSFER_DONE')}`)
         } else {
            msg.sendMessage(`${this.client.config.emojis.error} MEE6 has to be in the server for me to transfer data.`)
         }
      })
   }
}
