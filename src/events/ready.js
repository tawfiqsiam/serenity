const { Event } = require('@serenity/core');

module.exports = class extends Event {
   async run() {
      await this.client.statcord.autopost();
   }
};
