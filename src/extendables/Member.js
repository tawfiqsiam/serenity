const { Extendable } = require('@serenity/core');
const { SerenityMember } = require('@serenity/mg');

module.exports = class ArgonGuild extends Extendable {
   constructor(...args) {
      super(...args, {
         name: 'SerenityMember',
         appliesTo: [SerenityMember]
      });
   }

   getAvatar() {
      return this.user.displayAvatarURL({ size: 2048, dynamic: true }).replace('.webp', '.png');
   }
};
