const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['remindme', 'setreminder', 'remindmein'],
         requiredPermissions: ['USE_EXTERNAL_EMOJIS'],
         description: 'Make the bot remind you of something at a certain time.',
         usage: '<time:time> <message:string> [...]',
         usageDelim: ' '
      });
   }

   async run(msg, [time, ...message]) {
      const days = Math.ceil(new Date(time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      if (days > 90) throw `${this.client.config.emojis.error} You can't set a reminder for over 3 months.`;
      const r = await this.client.schedule.create('reminder', time, {
         data: {
            channel: msg.channel.id,
            user: msg.author.id,
            text: message.join(' ')
         }
      });
      return msg.channel.send(`${this.client.config.emojis.success} Created reminder.`);
   }
};
