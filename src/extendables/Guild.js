const { Extendable, SerenityGuild } = require('@serenity/core');

module.exports = class ArgonGuild extends Extendable {
   constructor(...args) {
      super(...args, {
         name: 'SerenityGuild',
         appliesTo: [SerenityGuild]
      });
   }

   getAvatar() {
      let avatar = this.iconURL({ size: 2048, dynamic: true });
      if (!avatar || avatar === null) return undefined;
      return avatar.replace('.webp', '.png');
   }
};
