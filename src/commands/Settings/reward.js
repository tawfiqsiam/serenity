const { Command } = require('@serenity/core');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: (language) => language.get('COMMAND_REWARD_DESCRIPTION'),
         usage: '<add|remove|list> (role:role) (level:integer{1})',
         requiredPermissions: ['EMBED_LINKS', 'MANAGE_ROLES'],
         subcommands: true
      });
      this.createCustomResolver('role', async (args, possible, msg, [action]) => {
         if (action === 'list') return args;
         if (await msg.hasAtLeastPermissionLevel(6)) {
            return this.client.arguments.get('role').run(args, possible, msg);
         }
         throw msg.language.get('COMMAND_REWARD_NO_PERMISSION');
      });
      this.createCustomResolver('integer', (args, possible, msg, [action]) => {
         if (!action) return;
         if (['list', 'remove'].includes(action)) return args;
         return this.client.arguments.get('integer').run(args, possible, msg);
      });
   }

   async add(msg, [role, level]) {
      let ignores = await this.getGuildRewards(msg.guild);
      if (await ignores.find((o) => o.role === role)) {
         throw msg.language.get('COMMAND_REWARD_ADD_EXISTS');
      }
      if (role.rawPosition <= msg.guild.me.roles.highest.rawPosition) {
         await this.addGuildReward(msg.guild, role.id, level);
         return msg.sendLocale('COMMAND_REWARD_ADD_SUCCESS');
      }
      throw msg.language.get('COMMAND_REWARD_ADD_ERROR');
   }

   async remove(msg, [role]) {
      let rewards = await this.getGuildRewards(msg.guild);
      if (!(await rewards.find((o) => o.role === role))) {
         throw msg.language.get('COMMAND_REWARD_REMOVE_NO_EXISTS');
      }
      await this.removeGuildReward(msg.guild, role.id);
      return msg.sendLocale('COMMAND_REWARD_REMOVE_SUCCESS');
   }

   async list(msg) {
      let rewards = await this.getGuildRewards(msg.guild);

      if (rewards.length == 0) {
         throw msg.language.get('COMMAND_REWARD_LIST_NONE');
      }

      let embed = new MessageEmbed()
         .setTitle(`🏆 ${msg.language.get('COMMAND_REWARD_LIST_REWARDS')}`)
         .setDescription(
            rewards
               .map((reward) => {
                  return `${reward.role} - ${msg.language.get('COMMAND_REWARD_LIST_LEVEL')} ${reward.level}`;
               })
               .join('\n')
         )
         .setColor(this.client.config.colors.default);
      return msg.sendMessage(embed);
   }

   async getGuildRewards(guild) {
      let rewards = await guild.settings.get('levels.rewards');
      let result = [];
      for (const reward of rewards) {
         let check = await guild.roles.cache.get(reward.role);
         if (!check || guild.me.roles.highest.rawPosition < check.rawPosition) {
            await this.removeGuildReward(guild, reward.role);
         } else {
            result.push({ role: check, level: reward.level });
         }
      }
      return result;
   }

   async addGuildReward(guild, role, level) {
      let rewards = await guild.settings.get('levels.rewards');
      let object = {
         role: role,
         level: level
      };
      await guild.settings.update('levels.rewards', object, { action: 'add' });
      return true;
   }

   async removeGuildReward(guild, role) {
      let rewards = await guild.settings.get('levels.rewards');
      let i = rewards.find((i) => i.role === role);
      await guild.settings.update('levels.rewards', i, { action: 'remove' });
      return true;
   }
};
