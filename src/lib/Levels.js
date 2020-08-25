const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const request = require('request');

class Levels {
   constructor(client) {
      this.client = client;
   }

   getLevelExp(level) {
      return 5 * Math.pow(level, 2) + 50 * level + 100;
   }

   getExpFromLevel(level) {
      let exp = 0;
      for (let i = level - 1; i >= 0; i--) {
         exp += this.getLevelExp(i);
      }
      return exp;
   }

   getLevelFromExp(exp) {
      let level = 0;

      while (exp >= this.getLevelExp(level)) {
         exp -= this.getLevelExp(level);
         level++;
      }

      return level;
   }

   getLevelProgress(exp) {
      let level = 0;

      while (exp >= this.getLevelExp(level)) {
         exp -= this.getLevelExp(level);
         level++;
      }

      return exp;
   }

   async getGlobalLeaderboard() {
      let provider = this.client.providers.get('mongodb');
      return await provider.db.collection('users').find({}, { limit: 100 }).sort({ exp: -1 }).toArray();
   }

   getGlobalExp(user) {
      return user.settings.get('exp');
   }

   async setGlobalExp(user, xp) {
      await user.settings.sync(true);
      return user.settings.update({
         exp: xp,
         tag: user.tag
      });
   }

   async giveGlobalExp(user) {
      if (moment().diff(user.timeout || 0) < 0) return;
      user.timeout = moment().add(1, 'minutes');

      const oldExp = this.getGlobalExp(user);
      const newExp = oldExp + this.client.util.randomInt(15, 25);

      await this.setGlobalExp(user, newExp);

      return;
   }

   async setGuildMemberExp(member, xp, update = false) {
      await member.settings.sync(true);
      if (update) await this.updateUserRoles(member);
      return member.settings.update({
         exp: xp
      });
   }

   getGuildLeaderboard(guild) {
      let leaderboard = [];
      guild.members.forEach((member) => {
         let xp = member.settings.get('exp');
         leaderboard.push({ exp: xp, member: member.id });
      });
      return leaderboard.sort((a, b) => parseFloat(b.exp) - parseFloat(a.exp));
   }

   getGuildMemberExp(member) {
      return member.settings.get('exp');
   }

   async transferLevels(guild) {
      return new Promise(async (fulfill, reject) => {
         await request.get(
            `https://mee6.xyz/api/plugins/levels/leaderboard/${guild.id}?page=0&limit=999`,
            async (err, res, b) => {
               let body = JSON.parse(b);
               if (body.status_code === 400 || body.error || err) fulfill(false);
               if (body.role_rewards && body.role_rewards.length !== 0) {
                  for (const entry of body.role_rewards) {
                     let role = guild.roles.get(entry.role);
                     if (!role || role === null) continue;
                     await this.client.rewards.addGuildReward(guild, role, entry.rank);
                  }
               }
               if (body.players && body.players.length !== 0) {
                  for (const entry of body.players) {
                     let member = guild.members.get(entry.id);
                     if (!member || member === null) continue;
                     await this.setGuildMemberExp(member, entry.xp, true);
                  }
               }
               await guild.settings.update('multiplier', body.xp_rate);
               fulfill(true);
            }
         );
      });
   }

   async giveGuildUserExp(member, msg) {
      if (moment().diff(member.timeout || 0) < 0) return;
      member.timeout = moment().add(1, 'minutes');

      const multiplier = msg.guild.settings.get('multiplier');
      const oldExp = await this.getGuildMemberExp(member);
      const oldLvl = this.getLevelFromExp(oldExp);
      const newExp = oldExp + this.client.util.randomInt(15, 25) * multiplier;
      const newLvl = this.getLevelFromExp(newExp);

      await this.setGuildMemberExp(member, newExp);

      if (oldLvl != newLvl) {
         await this.updateUserRoles(member);

         const check = await msg.guild.settings.get('rankup.enabled');
         if (!check) return;

         let type = msg.guild.settings.get('rankup.type');
         let text = msg.guild.settings.get('rankup.text');
         let dbChannel = msg.guild.settings.get('rankup.channel');
         let getChannel = msg.guild.channels.get(dbChannel);
         if (!getChannel) msg.guild.settings.reset('rankup.channel');

         text = text
            .replace(/\%member/gi, member)
            .replace(/\%username/gi, member.user.username)
            .replace(/\%level/gi, newLvl);

         switch (type) {
            case 'embed':
               let levelUpEmbed = new MessageEmbed().setColor(this.client.config.colors.default).setDescription(text);
               (await getChannel)
                  ? getChannel.send(levelUpEmbed).catch((err) => {
                       msg.guild.settings.reset('rankup.channel');
                       msg.channel.send(levelUpEmbed).catch((err) => {});
                    })
                  : msg.channel.send(levelUpEmbed).catch((err) => {});
               break;
            case 'message':
               (await getChannel)
                  ? getChannel.send(text).catch((err) => {
                       msg.guild.settings.reset('rankup.channel');
                       msg.channel.send(text).catch((err) => {});
                    })
                  : msg.channel.send(text).catch((err) => {});
               break;
         }
      }
      return;
   }

   async updateUserRoles(member) {
      try {
         const exp = await this.getGuildMemberExp(member);
         const lvl = this.getLevelFromExp(exp);
         if (lvl === 0) return;
         let rewards = await this.client.rewards.getGuildRewards(member.guild);
         if (rewards.length > 0) {
            let rolesToAdd = [];
            for (const reward of rewards) {
               if (reward.level > lvl) return;
               if (!member.roles.has(reward) && member.guild.me.roles.highest.rawPosition > reward.role.rawPosition) {
                  rolesToAdd.push(reward.role);
               }
            }
            try {
               if (!member.roles.has(rolesToAdd)) {
                  return await member.roles.add(rolesToAdd).catch((err) => {});
               }
               return;
            } catch (err) {
               console.log(err);
               return member.client.rewards.removeGuildReward(member.guild, rolesToAdd);
            }
         }
         return;
      } catch (err) {
         console.log(err);
      }
   }
}

module.exports = Levels;
