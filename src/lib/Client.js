const { KlasaClient } = require('klasa');
const Config = require('../config');
const Levels = require('./Levels');
const Rewards = require('./Rewards');
const Util = require('./Util');
const Schemas = require('./schemas/Schemas');

module.exports = class SerenityClient extends KlasaClient {
   constructor(options) {
      super(options);
      this.levels = new Levels(this);
      this.rewards = new Rewards(this);
      this.config = Config;
      this.util = Util;
   }
}
