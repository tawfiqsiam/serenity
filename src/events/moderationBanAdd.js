const { Event } = require('klasa')

module.exports = class extends Event {
   async run(member, moderator, reason) {
      let modlog = new this.client.modlog(member.guild)
         .setType('ban')
         .setModerator(moderator, this.client)
         .setUser(member)
         .send()
   }
}
