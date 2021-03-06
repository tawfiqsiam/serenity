const { Inhibitor } = require('@serenity/core');

module.exports = class extends Inhibitor {
   async run(msg, command) {
      if (msg.channel.type === 'dm') return true;
      if (msg.hasAtLeastPermissionLevel(6) && command.name === 'ignore') return;
      let check = await msg.guild.settings.get('levels.ignores');
      let ignore = await check.find((o) => o.channel === msg.channel.id && o.commands === false);
      if (ignore) throw true;
   }
};
