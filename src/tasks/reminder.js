const { Task } = require('klasa');

module.exports = class extends Task {
   async run({ channel: _channel, user: _user, text }) {
      const channel = this.client.channels.fetch(_channel).catch(() => null);
      const user = await this.client.users.fetch(_user).catch(() => null);

      if (!channel) {
         if (user) {
            return user.send(`⏰ **Reminder:** ${text}`).catch(() => null);
         }
      }

      const member = channel.guild.members.fetch(user.id).catch(() => null);
      if (channel && member) {
         return channel.send(`📘 | <@${user}>, **Reminder:** ${text}`).catch(() => null);
      }
   }
};
