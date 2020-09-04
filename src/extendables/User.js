const { Extendable, SerenityUser } = require('@serenity/core');

module.exports = class ArgonGuild extends Extendable {
   constructor(...args) {
      super(...args, {
         name: 'SerenityUser',
         appliesTo: [SerenityUser]
      });
   }

   getAvatar() {
      return this.displayAvatarURL({ size: 2048, dynamic: true }).replace('.webp', '.png');
   }
};
