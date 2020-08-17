const { Extendable, KlasaUser } = require('klasa');

module.exports = class ArgonGuild extends Extendable {
  constructor(...args) {
    super(...args, {
      name: 'User',
      appliesTo: [KlasaUser]
    })
  }

  getAvatar() {
    return this.displayAvatarURL({ size: 2048, dynamic: true }).replace('.webp', '.png');
  }
}