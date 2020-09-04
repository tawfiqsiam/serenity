const {
   Argument,
   util: { regExpEsc }
} = require('@serenity/core');
const { GuildMember, User } = require('discord.js');
const USER_REGEXP = Argument.regex.userOrMember;

module.exports = class extends Argument {
   async run(arg, possible, msg) {
      if (!msg.guild) return this.store.get('user').run(arg, possible, msg);
      const resUser = await this.resolveUser(arg, msg.guild);
      if (resUser) return resUser;

      const results = [];
      const reg = new RegExp(regExpEsc(arg), 'i');
      for (const member of msg.guild.members.cache.values()) {
         if (reg.test(member.user.username)) results.push(member.user);
      }

      let querySearch;
      if (results.length > 0) {
         const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, 'i');
         const filtered = results.filter((user) => regWord.test(user.username));
         querySearch = filtered.length > 0 ? filtered : results;
      } else {
         querySearch = results;
      }

      switch (querySearch.length) {
         case 0:
            throw msg.language.get('RESOLVER_INVALID_USER', possible.name);
         case 1:
            return querySearch[0];
         default:
            throw `Found multiple matches: \`${querySearch.map((user) => user.tag).join('`, `')}\``;
      }
   }

   async resolveUser(query, guild) {
      if (query instanceof GuildMember) return query.user;
      if (query instanceof User) return query;
      if (typeof query === 'string') {
         if (USER_REGEXP.test(query)) return guild.client.users.fetch(USER_REGEXP.exec(query)[1]).catch(() => null);
         if (/\w{1,32}#\d{4}/.test(query)) {
            const res = guild.members.cache.find((member) => member.user.tag === query);
            return res ? res.user : null;
         }
      }
      return null;
   }
};
