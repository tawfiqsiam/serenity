const { Event } = require('klasa');

module.exports = class extends Event {
   async run() {
      await this.client.statcord.autopost();
   }
};
