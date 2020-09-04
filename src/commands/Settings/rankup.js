const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: (language) => language.get('COMMAND_RANKUP_DESCRIPTION'),
         usage: '<toggle|mode|text|channel> (input:...string) [...]',
         permissionLevel: 6,
         requiredPermissions: ['EMBED_LINKS'],
         subcommands: true
      });
      this.createCustomResolver('...string', async (args, possible, msg, [action]) => {
         let possibles = ['embed', 'message'];
         if (action === 'mode' && !possibles.includes(args)) {
            throw msg.language.get('COMMAND_RANKUP_NO_POSSIBLES', possibles.join(', '));
         } else if (action === 'channel') {
            if (args && args == 'current') return args;
            let arg = await this.client.arguments.get('channel').run(args, possible, msg);
            if (arg.viewable) return arg;
            throw msg.language.get('COMMAND_RANKUP_NO_ACCESS');
         } else if (action === 'toggle') return;
         if (args) return args;
         return this.client.arguments.get('...string').run(args, possible, msg);
      });
   }

   async toggle(msg) {
      let check = msg.guild.settings.get('levels.rankup.enabled');
      let boolean = check ? false : true;
      await msg.guild.settings.update('levels.rankup.enabled', boolean);
      return msg.sendLocale('COMMAND_RANKUP_TOGGLE_SUCCESS', [boolean]);
   }

   async mode(msg, [input]) {
      let check = msg.guild.settings.get('levels.rankup.type');
      if (check === input) throw msg.language.get('COMMAND_RANKUP_MODE_EXISTS', input);
      await msg.guild.settings.update('levels.rankup.type', input);
      return msg.sendLocale('COMMAND_RANKUP_MODE_SUCCESS', [input]);
   }

   async text(msg, [...input]) {
      input = input.length > 0 ? input.join(' ') : input;
      let check = msg.guild.settings.get('levels.rankup.text');
      if (check === input) throw msg.language.get('COMMAND_RANKUP_MESSAGE_EXISTS', input);
      await msg.guild.settings.update('levels.rankup.text', input);
      if (!input.includes(('%member' && '%level') || ('%username' && '%level'))) {
         let embed = new MessageEmbed().setColor(this.client.config.colors.default).setDescription(msg.language.get('COMMAND_RANKUP_TEXT_MISSING'));
         msg.sendMessage(embed);
      }
      return msg.sendLocale('COMMAND_RANKUP_MESSAGE_SUCCESS', [input]);
   }

   async channel(msg, [channel]) {
      if (channel == 'current') {
         let check = msg.guild.settings.get('levels.rankup.channel');
         if (check === channel) throw msg.language.get('COMMAND_RANKUP_CHANNEL_CURRENT_EXISTS');
         await msg.guild.settings.update('levels.rankup.channel', channel);
         return msg.sendLocale('COMMAND_RANKUP_CHANNEL_CURRENT_SUCCESS');
      } else {
         let check = msg.guild.settings.get('levels.rankup.channel');
         if (check === channel.id) throw msg.language.get('COMMAND_RANKUP_CHANNEL_EXISTS', channel.id);
         await msg.guild.settings.update('levels.rankup.channel', channel.id);
         return msg.sendLocale('COMMAND_RANKUP_CHANNEL_SUCCESS', [channel.id]);
      }
   }
};
