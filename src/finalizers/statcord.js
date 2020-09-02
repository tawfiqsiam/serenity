const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {
   async run(msg, command) {
      await this.client.statcord.postCommand(command.name, msg.author.id);
   }
};
