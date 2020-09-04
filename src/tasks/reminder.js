const { Task } = require('@serenity/core');

module.exports = class extends Task {
   async run({ channel: _channel, user: _user, text }) {
      const channel = await this.client.channels.cache.get(_channel);
      const user = await this.client.users.fetch(_user);

      if (!channel && user) {
         return user.send(`⏰ **Reminder:** ${text}`).catch(() => null);
      }

      if (channel && channel.guild.members.cache.fetch(user.id)) {
         return channel.send(`📘 | ${user}, **Reminder:** ${text}`).catch(() => {
            return user.send(`⏰ **Reminder:** ${text}`).catch(() => null);
         });
      }
   }
};
