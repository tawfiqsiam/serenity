const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {
   async run(msg, command) {
      if (command.category !== 'Utility') {
         await this.client.statcord.postCommand(command.name, msg.author.id);
      }
   }
};
