const { Task } = require('klasa');

module.exports = class extends Task {
   async run({ channel, user, text }) {
      const _channel = this.client.channels.fetch(channel).catch(console.error);
      const _user = await this.client.users.fetch(user).catch(console.error);

      if (_user) return _user.send(`⏰ **Reminder:** ${text}`).catch(console.error);
      if (_channel) return _channel.send(`📘 | <@${user}>, **Reminder:** ${text}`).catch(console.error);
   }
};
