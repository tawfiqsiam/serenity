const { Command } = require('@serenity/core');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         guarded: true,
         permissionLevel: 10,
         hidden: true,
         description: (language) => language.get('COMMAND_PING_DESCRIPTION')
      });
   }

   async run(msg) {
      const message = await msg.sendLocale('COMMAND_PING');
      return msg.sendLocale('COMMAND_PINGPONG', [
         (message.editedTimestamp || message.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp),
         Math.round(this.client.ws.ping)
      ]);
   }
};
