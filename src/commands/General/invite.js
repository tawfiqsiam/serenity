const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['inv'],
         guarded: true,
         description: `Sends a client invite.`,
      })
   }

   async run(msg) {
      msg.sendMessage(this.client.invite)
   }
}; 