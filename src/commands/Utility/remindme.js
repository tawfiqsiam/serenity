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
