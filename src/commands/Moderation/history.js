const { Command, util, RichDisplay } = require('klasa');
const { MessageEmbed } = require('discord.js');
const time = 1000 * 60 * 3;

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'history',
         permissionLevel: 3,
         runIn: ['text'],
         description: `Gets mod log history of a user.`,
         usage: '<user:user>'
      });
      this.handlers = new Map();
   }

   async run(msg, [user]) {
      const userlogs = msg.guild.settings
         .get('data.modlogs')
         .filter((log) => log.user.id === user.id)
         .reverse();
      if (userlogs.length === 0) return msg.send(`${this.client.config.error} No history for ${user.tag}.`);
      const previousHandler = this.handlers.get(msg.author.id);
      if (previousHandler) previousHandler.stop();
      const handler = await (await this.buildDisplay(msg, user, userlogs)).run(msg, {
         filter: (reaction, user) => user.id === msg.author.id,
         time: time,
         jump: false
      });
      handler.on('end', () => this.handlers.delete(msg.author.id));
      this.handlers.set(msg.author.id, handler);
      return handler;
   }

   async buildDisplay(msg, user, userlogs) {
      const display = new RichDisplay();
      for (const log of userlogs) {
         const embed = new MessageEmbed()
            .setColor(this.client.modlog.colour(log.type))
            .setTitle(this.client.modlog.action(log.type))
            .addField(`**Member**`, `${log.user.tag} (${log.user.id})`)
            .setThumbnail(log.user.avatar)
            .addField(`**Reason**`, log.reason.current)
            .setFooter(`Case ${log.case}`)
            .setAuthor(log.moderator.tag, log.moderator.avatar)
            .setTimestamp(log.date);

         if (log.type === 'mute' || log.type === 'unmute') {
            if (log.duration && log.duration !== null) {
               if (log.type === 'unmute') embed.addField('**Original Mute Duration**', log.duration);
               if (log.type === 'mute') embed.addField('**Mute Duration**', log.duration);
            }
         }
         if (log.type === 'unmute' && log.reason.original) embed.addField('**Original Mute Reason**', log.reason.original);
         display.addPage(embed);
      }

      return display;
   }
};
