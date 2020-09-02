const Schemas = require('./schemas/Schemas');
const { Client } = require('statcord.js');
const { KlasaClient } = require('klasa');
const Rewards = require('./Rewards');
const Config = require('../config');
const Levels = require('./Levels');
const Util = require('./Util');

module.exports = class SerenityClient extends KlasaClient {
   constructor(options) {
      super(options);
      this.levels = new Levels(this);
      this.rewards = new Rewards(this);
      this.config = Config;
      this.util = Util;
   }
};
