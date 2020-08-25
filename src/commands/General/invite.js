const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['inv'],
         guarded: true,
         description: `Sends a client invite.`
      });
   }

   async run(msg) {
      msg.sendMessage('https://discord.com/oauth2/authorize/?permissions=1409666049&scope=bot&client_id=713054765025722440');
   }
};
