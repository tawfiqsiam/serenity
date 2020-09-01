const { MessageEmbed } = require('discord.js');

module.exports = class ModLog {
   constructor(guild) {
      this.guild = guild;

      this.case = null;
      this.user = null;
      this.moderator = null;
      this.duration = null;
      this.type = null;
      this.reason = {
         current: 'None provided.'
      };
   }

   toUpperCase(string) {
      return `${string[0].toUpperCase()}${string.slice(1)}`;
   }

   setType(type) {
      this.type = type;
      return this;
   }

   setUser(member) {
      this.user = {
         id: member.id,
         tag: member.user.tag,
         avatar: member.getAvatar()
      };
      return this;
   }

   setModerator(member) {
      this.moderator = {
         id: member.id,
         tag: member.user.tag,
         avatar: member.getAvatar()
      };
      return this;
   }

   setDuration(duration) {
      this.duration = this.toUpperCase(duration);
      return this;
   }

   setReason(reasons) {
      this.reason = {
         current: reasons.current ? reasons.current : 'No reason provided.',
         original: reasons.original ? reasons.original : undefined
      };
      return this;
   }

   async send() {
      if (this.type == 'mute') {
         await this.guild.settings.update('mutedUsers', this.user.id, { arrayAction: 'add' });
      } else if (this.type == 'unmute') {
         await this.guild.settings.update('mutedUsers', this.user.id, { arrayAction: 'remove' });
      }
      const get = this.guild.settings.get('channels.modlog');
      if (!get || get === null) return;
      const channel = await this.guild.channels.get(get);
      if (!channel) return;
      await this.getCase();
      return channel.send({ embed: this.embed });
   }

   get embed() {
      const embed = new MessageEmbed()
         .setColor(ModLog.colour(this.type))
         .setTitle(ModLog.action(this.type))
         .addField(`**Member**`, `${this.user.tag} (${this.user.id})`)
         .setThumbnail(this.user.avatar)
         .addField(`**Reason**`, this.reason.current)
         .setFooter(`Case ${this.case}`)
         .setAuthor(this.moderator.tag, this.moderator.avatar)
         .setTimestamp();

      if (this.type === 'mute' || this.type === 'unmute') {
         if (this.duration && this.duration !== null) {
            if (this.type === 'unmute') embed.addField('**Original Mute Duration**', this.duration);
            if (this.type === 'mute') embed.addField('**Mute Duration**', this.duration);
         }
      }
      if (this.type === 'unmute' && this.reason.original) embed.addField('**Original Mute Reason**', this.reason.original);

      return embed;
   }

   async getCase() {
      this.case = this.guild.settings.get('data.modlogs').length + 1;
      this.guild.settings.update('data.modlogs', this.pack);
      return this.case;
   }

   get pack() {
      let object = {
         type: this.type,
         user: this.user,
         moderator: this.moderator,
         reason: this.reason,
         case: this.case,
         date: Date.now()
      };

      if (this.type === 'mute' || this.type === 'unmute') {
         object.duration = this.duration;
      }

      return object;
   }

   static colour(type) {
      switch (type) {
         case 'ban':
            return '#FF311D';
         case 'kick':
            return '#FF311D';
         case 'softban':
            return '#FF311D';
         case 'warn':
            return '#E67E22';
         case 'mute':
            return '#FCC141';
         case 'unban':
            return '#21CC71';
         case 'unmute':
            return '#21CC71';
         default:
            return '#FFFFFF';
      }
   }

   static action(type) {
      switch (type) {
         case 'ban':
            return 'Member Banned';
         case 'kick':
            return 'Member Kicked';
         case 'softban':
            return 'Member Softbanned';
         case 'warn':
            return 'Member Warned';
         case 'mute':
            return 'Member Muted';
         case 'unban':
            return 'Member Unbanned';
         case 'unmute':
            return 'Member Unmuted';
      }
   }
};
