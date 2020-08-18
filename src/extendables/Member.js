const { Extendable } = require('klasa')
const { KlasaMember } = require('klasa-member-gateway')

module.exports = class ArgonGuild extends Extendable {
   constructor(...args) {
      super(...args, {
         name: 'Member',
         appliesTo: [KlasaMember],
      })
   }

   getAvatar() {
      return this.user.displayAvatarURL({ size: 2048, dynamic: true }).replace('.webp', '.png')
   }
}
