const { Task } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Task {
  async run({ guild, user, duration, reason, caseNumber }) {
    const server = this.client.guilds.get(guild);
    if (!server) return;
    const member = await server.members.fetch(user).catch(() => null);
    if (!member) return;

    let result = await this.client.util.getMutedRole(server);
    if (result.created === true) return;

    if (member.roles.has(result.role.id)) {
      await member.roles.remove(result.role.id);
      if (server.settings.get('toggles.nickmute') && member.nickname && member.nickname.includes("[Muted]")) {
        member.setNickname(member.nickname.replace('[Muted] ', ''))
      };
    } else return;

    new this.client.modlog(server)
      .setType('unmute')
      .setUser(member)
      .setModerator(server.me)
      .setDuration(duration)
      .setReason({ current: "Muted Expired", original: reason })
      .send();
  }
};