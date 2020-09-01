const { Command, Duration } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         permissionLevel: 6,
         requiredPermissions: ['MANAGE_ROLES'],
         runIn: ['text'],
         description: 'Unmutes a mentioned user.',
         usage: '<member:member> [reason:...string]',
         usageDelim: ' '
      });
   }

   async run(msg, [member, reason]) {
      if (member.roles.highest.position >= msg.member.roles.highest.position) {
         throw `${this.client.config.emojis.error} You cannot unmute this user.`;
      }
      if (msg.guild.me.roles.highest.position <= member.roles.highest.position) {
         throw `${this.client.config.emojis.error} I cannot unmute this user.`;
      }
      let result = await this.client.util.getMutedRole(msg.guild);
      if (!member.roles.has(result.role.id)) throw `${this.client.config.emojis.error} This user is not muted.`;

      await member.roles.remove(result.role.id);

      if (msg.guild.settings.get('toggles.nickmute') && member.nickname && member.nickname.includes('[Muted]')) {
         member.setNickname(member.nickname.replace('[Muted] ', ''));
      }

      const get = msg.guild.settings.get('data.modlogs').filter((m) => m.user.id === member.id && m.type === 'mute');
      const filtered = get[get.length - 1];

      if (msg.guild.settings.get('channels.modlog')) {
         new this.client.modlog(msg.guild)
            .setType('unmute')
            .setModerator(msg.member)
            .setUser(member)
            .setDuration(filtered.duration)
            .setReason({ current: reason })
            .send();
      }

      return msg.sendMessage(`${this.client.config.emojis.success} ${member.user.tag} was unmuted${reason ? ` with reason: ${reason}.` : '.'}`);
   }
};
