const { Finalizer } = require('@serenity/core');

module.exports = class extends Finalizer {
   async run(msg, command) {
      if (command.category !== 'System') {
         await this.client.statcord.postCommand(command.name, msg.author.id);
      }
   }
};
