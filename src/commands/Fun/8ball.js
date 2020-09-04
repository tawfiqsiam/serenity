const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

const fortunes = [
   'As I see it, yes.',
   'Ask again later.',
   'Better not tell you now.',
   'Cannot predict now.',
   'Concentrate and ask again.',
   'Don’t count on it.',
   'It is certain.',
   'It is decidedly so.',
   'Most likely.',
   'My reply is no.',
   'My sources say no.',
   'Outlook not so good.',
   'Outlook good.',
   'Reply hazy, try again.',
   'Signs point to yes.',
   'Very doubtful.',
   'Without a doubt.',
   'Yes.',
   'Yes – definitely.'
];

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         enabled: true,
         runIn: ['text'],
         permLevel: 0,
         requiredPermissions: ['EMBED_LINKS'],
         description: 'Gives you a random answer to a question.',
         usage: '<question:string>'
      });
   }

   async run(msg, [question]) {
      return msg.sendMessage(
         new MessageEmbed()
            .addField('❓ Question', question)
            .addField('🎱 8ball', fortunes[Math.floor(Math.random() * fortunes.length)])
            .setColor(this.client.config.colors.default)
      );
   }
};
