const { Command } = require('@serenity/core');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['remindme', 'setreminder', 'remindmein'],
         requiredPermissions: ['USE_EXTERNAL_EMOJIS'],
         description: (language) => language.get('COMMAND_REMINDME_DESCRIPTION'),
         usage: '<time:time> <message:string> [...]',
         usageDelim: ' '
      });
   }

   async run(msg, [time, ...message]) {
      const days = Math.ceil(new Date(time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      if (days > 90) throw msg.language.get('COMMAND_REMINDME_TOO_LONG');
      const r = await this.client.schedule.create('reminder', time, {
         data: {
            channel: msg.channel.id,
            user: msg.author.id,
            text: message.join(' ')
         }
      });
      return msg.sendLocale('COMMAND_REMINDME_SUCESS');
   }
};
