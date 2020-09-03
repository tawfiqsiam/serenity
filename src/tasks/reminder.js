const { Task } = require('klasa');

module.exports = class extends Task {
   async run({ channel: _channel, user: _user, text }) {
      const channel = await this.client.channels.get(_channel);
      const user = await this.client.users.fetch(_user);

      if (!channel && user) {
         return user.send(`⏰ **Reminder:** ${text}`).catch(() => null);
      }

      if (channel && channel.guild.members.fetch(user.id)) {
         return channel.send(`📘 | ${user}, **Reminder:** ${text}`).catch(() => {
            return user.send(`⏰ **Reminder:** ${text}`).catch(() => null);
         });
      }
   }
};
